import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE;
const isProduction = process.env.NODE_ENV === "production";

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set. Create a .env file (see .env.example) and set it there — never hardcode credentials in source.");
  process.exit(1);
}

// Middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// Very small, dependency-free rate limiter for write endpoints (per-IP sliding window)
const rateLimitBuckets = new Map();
const rateLimit = (max, windowMs) => (req, res, next) => {
  const key = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const now = Date.now();
  const bucket = rateLimitBuckets.get(key)?.filter((t) => now - t < windowMs) || [];
  if (bucket.length >= max) {
    return res.status(429).json({ error: "Too many requests. Please slow down." });
  }
  bucket.push(now);
  rateLimitBuckets.set(key, bucket);
  next();
};

// Requires the owner's passcode (kept only in server-side .env, never shipped to the browser bundle)
// on every mutating/admin-only request. Closes the hole where the old client-only passcode check
// in Admin.tsx could be bypassed entirely by calling these endpoints directly (e.g. via curl).
const requireAdmin = (req, res, next) => {
  if (!ADMIN_PASSCODE) {
    return res.status(503).json({ error: "Admin routes are disabled: ADMIN_PASSCODE is not configured on the server." });
  }
  const supplied = req.headers["x-admin-passcode"];
  if (supplied !== ADMIN_PASSCODE) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

// Sends a generic message to the client but logs full detail server-side only.
// Prevents leaking internal error messages/stack traces (e.g. DB internals) to anonymous callers.
const sendServerError = (res, publicMessage, error) => {
  console.error(publicMessage, error);
  res.status(500).json({ error: publicMessage, ...(isProduction ? {} : { details: error.message }) });
};

// In-Memory Latency Cache System (0ms response speed)
let memoryCache = {
  data: null,
  lastFetched: 0,
  ttl: 60 * 1000 // 60 seconds TTL
};

const getCollection = () => mongoose.connection.db.collection("portfolios");

// GET /api/portfolio - High Performance Fetching with 0ms Cache + MongoDB Atlas Sync
app.get("/api/portfolio", async (req, res) => {
  try {
    const now = Date.now();
    // Return instant 0ms cached response if valid
    if (memoryCache.data && (now - memoryCache.lastFetched < memoryCache.ttl)) {
      res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
      res.setHeader("X-Data-Source", "RAM-Cache-0ms");
      return res.json(memoryCache.data);
    }

    const col = getCollection();
    const doc = await col.findOne({ key: "main_portfolio" });
    if (!doc) {
      return res.status(404).json({ error: "Portfolio document not found in MongoDB database" });
    }

    delete doc._id;
    delete doc.key;
    delete doc.createdAt;
    delete doc.updatedAt;

    // Update RAM Cache
    memoryCache.data = doc;
    memoryCache.lastFetched = now;

    res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    res.setHeader("X-Data-Source", "MongoDB-Atlas");
    res.json(doc);
  } catch (error) {
    console.error("Error fetching portfolio from MongoDB:", error);
    // If Mongo is temporarily slow/reconnecting, serve stale RAM cache if available
    if (memoryCache.data) {
      res.setHeader("X-Data-Source", "Stale-RAM-Cache");
      return res.json(memoryCache.data);
    }
    sendServerError(res, "Failed to fetch portfolio data", error);
  }
});

// PUT /api/portfolio - Update MongoDB Atlas & Invalidate RAM Cache instantly
app.put("/api/portfolio", requireAdmin, async (req, res) => {
  try {
    const col = getCollection();
    const updatedData = req.body;
    if (!updatedData || typeof updatedData !== "object" || Array.isArray(updatedData)) {
      return res.status(400).json({ error: "Request body must be a portfolio data object" });
    }

    // 1. Direct MongoDB Atlas Update
    await col.updateOne(
      { key: "main_portfolio" },
      { $set: { ...updatedData, updatedAt: new Date() } },
      { upsert: true }
    );

    // 2. Instant RAM Cache Update (0ms delay for subsequent reads)
    memoryCache.data = updatedData;
    memoryCache.lastFetched = Date.now();

    res.json({ message: "Portfolio updated in MongoDB Atlas and RAM Cache refreshed", data: updatedData });
  } catch (error) {
    sendServerError(res, "Failed to update portfolio data", error);
  }
});

// POST /api/upload - Upload base64 image directly to Cloudinary or return hosted URL
app.post("/api/upload", requireAdmin, rateLimit(20, 60 * 1000), async (req, res) => {
  try {
    const { image } = req.body;
    if (!image || typeof image !== "string") {
      return res.status(400).json({ error: "No image payload provided" });
    }
    if (!/^data:image\/(png|jpe?g|webp|gif|svg\+xml);base64,/.test(image)) {
      return res.status(400).json({ error: "Only base64-encoded image data URIs (png/jpg/webp/gif/svg) are accepted" });
    }
    if (image.length > 8 * 1024 * 1024) {
      return res.status(413).json({ error: "Image is too large (max ~5MB)" });
    }

    // If Cloudinary keys are configured, upload to Cloudinary
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      const { v2: cloudinary } = await import("cloudinary");
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      const result = await cloudinary.uploader.upload(image, {
        folder: "swaraj_portfolio",
        resource_type: "auto",
      });

      return res.json({
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
        source: "Cloudinary",
      });
    } else {
      // If Cloudinary keys not yet set in .env, return base64 / direct image data
      return res.json({
        success: true,
        url: image,
        source: "Direct",
        message: "Cloudinary keys not set in .env. Stored directly."
      });
    }
  } catch (error) {
    sendServerError(res, "Failed to upload image", error);
  }
});

// POST /api/contact - Store Contact Form Messages in MongoDB Atlas
app.post("/api/contact", rateLimit(5, 10 * 60 * 1000), async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string" ||
        !name.trim() || !message.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "A valid name, email, and message are required." });
    }
    if (name.length > 200 || email.length > 200 || message.length > 5000) {
      return res.status(400).json({ error: "Submission is too long." });
    }

    const messagesCol = mongoose.connection.db.collection("contact_messages");
    await messagesCol.insertOne({
      name,
      email,
      message,
      createdAt: new Date(),
      ip: req.ip || req.headers["x-forwarded-for"] || "unknown",
      userAgent: req.headers["user-agent"] || "unknown"
    });

    console.log(`📩 New Contact Message received from ${name} (${email})`);
    res.json({ success: true, message: "Your message has been received and saved!" });
  } catch (error) {
    sendServerError(res, "Failed to save message", error);
  }
});

// GET /api/contact/messages - View received messages in Admin
app.get("/api/contact/messages", requireAdmin, async (req, res) => {
  try {
    const messagesCol = mongoose.connection.db.collection("contact_messages");
    const messages = await messagesCol.find({}).sort({ createdAt: -1 }).limit(50).toArray();
    res.json({ success: true, messages });
  } catch (error) {
    sendServerError(res, "Failed to fetch messages", error);
  }
});

// POST /api/admin/verify - Lets the Admin UI check a passcode server-side before unlocking
app.post("/api/admin/verify", rateLimit(10, 60 * 1000), (req, res) => {
  if (!ADMIN_PASSCODE) {
    return res.status(503).json({ error: "Admin routes are disabled: ADMIN_PASSCODE is not configured on the server." });
  }
  const { passcode } = req.body;
  if (passcode === ADMIN_PASSCODE) {
    return res.json({ success: true });
  }
  res.status(401).json({ success: false, error: "Invalid passcode" });
});

// Health check endpoint for uptime monitors
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    mongoState: mongoose.connection.readyState === 1 ? "connected" : "connecting",
    cloudinaryConfigured: Boolean(process.env.CLOUDINARY_CLOUD_NAME),
    timestamp: new Date()
  });
});

// Serve static React build files in production mode
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "../dist");
  app.use(express.static(clientBuildPath, { maxAge: "1d" }));
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

// Optimized Async Connection & Server Launch
const startServer = async () => {
  try {
    console.log("Connecting to MongoDB Atlas Cluster with Connection Pooling...");
    await mongoose.connect(MONGODB_URI, {
      family: 4,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000
    });
    console.log("Connected successfully to MongoDB Atlas!");

    app.listen(PORT, () => {
      console.log(`🚀 Production High-Performance API Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB Atlas:", err.message);
  }
};

startServer();
