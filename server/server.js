import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://syamalaswaraj_db_user:swaraj2005@task.h1u2xxb.mongodb.net/portfolio?retryWrites=true&w=majority&appName=TASK";
const isProduction = process.env.NODE_ENV === "production";

// Default admin passkey fallback if not set in environment or MongoDB
const DEFAULT_FALLBACK_PASSCODE = process.env.ADMIN_PASSCODE || "swaraj2026";
const ADMIN_NOTIFICATION_EMAIL = "swarajvecha@gmail.com";

// In-Memory Passcode Cache for fast access
let cachedAdminPasscode = null;
let lastPasscodeCheck = 0;

// Dynamic Admin Passkey Resolver (from MongoDB Atlas or .env fallback)
const getAdminPasscode = async () => {
  const now = Date.now();
  if (cachedAdminPasscode && now - lastPasscodeCheck < 30 * 1000) {
    return cachedAdminPasscode;
  }
  try {
    if (mongoose.connection.readyState === 1) {
      const col = mongoose.connection.db.collection("admin_settings");
      const doc = await col.findOne({ key: "admin_auth" });
      if (doc && doc.passcode) {
        cachedAdminPasscode = doc.passcode;
        lastPasscodeCheck = now;
        return cachedAdminPasscode;
      }
    }
  } catch (err) {
    console.error("Error reading dynamic passkey from MongoDB:", err.message);
  }
  cachedAdminPasscode = process.env.ADMIN_PASSCODE || DEFAULT_FALLBACK_PASSCODE;
  lastPasscodeCheck = now;
  return cachedAdminPasscode;
};

// In-memory OTP Security Store
let activeOtpSession = null; // { otp: string, expiresAt: number, attempts: number }

// Email Transporter for OTP dispatch
const createMailTransporter = () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_PASS.trim().length > 0) {
    return nodemailer.createTransport({
      service: process.env.SMTP_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER.trim(),
        pass: process.env.EMAIL_PASS.trim(),
      },
    });
  }
  return null;
};

// Send OTP to swarajvecha@gmail.com
const sendOtpEmail = async (otp) => {
  console.log(`\n======================================================`);
  console.log(`🔐 [ADMIN SECURITY OTP]`);
  console.log(`📧 Recipient: ${ADMIN_NOTIFICATION_EMAIL}`);
  console.log(`🔑 Verification OTP: [ ${otp} ]`);
  console.log(`⏰ Expiration: 10 minutes`);
  console.log(`======================================================\n`);

  const transporter = createMailTransporter();
  if (!transporter) {
    console.log(`ℹ️ [EMAIL NOTICE] EMAIL_USER / EMAIL_PASS not fully configured in .env. OTP printed to server console.`);
    return { sent: false, method: "console" };
  }

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FDFBF7; padding: 32px; border: 4px solid #000; max-width: 540px; margin: 0 auto; box-shadow: 6px 6px 0px #000;">
      <div style="background-color: #FFD93D; border: 3px solid #000; padding: 12px 16px; margin-bottom: 24px; font-weight: 900; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">
        ⚡ Swaraj Portfolio Security Center
      </div>
      <h2 style="font-size: 24px; font-weight: 900; color: #000; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: -0.5px;">
        Admin Passkey Change Request
      </h2>
      <p style="font-size: 14px; font-weight: 600; color: #222; line-height: 1.6; margin-bottom: 20px;">
        A request was made to verify your identity and update the master administrator passkey for your portfolio.
      </p>
      <div style="background-color: #ffffff; border: 4px solid #000; padding: 24px; text-align: center; margin: 24px 0; box-shadow: 5px 5px 0px #FF6B6B;">
        <div style="font-size: 11px; font-weight: 900; text-transform: uppercase; color: #666; letter-spacing: 2px; margin-bottom: 8px;">
          One-Time Verification Code (OTP)
        </div>
        <div style="font-size: 40px; font-weight: 900; letter-spacing: 10px; color: #000; font-family: monospace;">
          ${otp}
        </div>
        <div style="font-size: 12px; font-weight: 800; color: #FF6B6B; margin-top: 10px; text-transform: uppercase; letter-spacing: 1px;">
          ⏱️ Valid for 10 minutes
        </div>
      </div>
      <p style="font-size: 12px; color: #666; line-height: 1.5; margin: 0;">
        If you did not initiate this request, you can safely ignore this email. Your existing passkey will remain active and unchanged.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Swaraj Portfolio Security" <${process.env.EMAIL_USER}>`,
      to: ADMIN_NOTIFICATION_EMAIL,
      subject: `🔐 Admin Passkey Change OTP: ${otp}`,
      text: `Your 6-digit OTP to change your Swaraj Portfolio Admin Passkey is: ${otp}. It is valid for 10 minutes.`,
      html,
    });
    return { sent: true, method: "email" };
  } catch (err) {
    console.error("Failed to deliver OTP via SMTP transport:", err.message);
    return { sent: false, error: err.message, method: "console" };
  }
};

// Robust CORS configuration for Vercel Frontend + Render Backend
app.use(cors({
  origin: (origin, callback) => {
    // Allow any origin (Vercel domains, preview deployments, custom domains, and localhost)
    callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-admin-passcode", "Authorization", "Accept"],
}));
app.options("*", cors());

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

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

// Middleware: Requires the active dynamic admin passcode on every mutating/admin-only request
const requireAdmin = async (req, res, next) => {
  const activePasscode = await getAdminPasscode();
  const supplied = req.headers["x-admin-passcode"];
  if (!supplied || supplied !== activePasscode) {
    return res.status(401).json({ error: "Unauthorized: Invalid or missing admin passcode" });
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

// POST /api/upload-cv - Upload base64 PDF (CV/Resume) to Cloudinary or store directly
app.post("/api/upload-cv", requireAdmin, rateLimit(10, 60 * 1000), async (req, res) => {
  try {
    const { file } = req.body;
    if (!file || typeof file !== "string") {
      return res.status(400).json({ error: "No file payload provided" });
    }
    if (!/^data:application\/pdf;base64,/.test(file)) {
      return res.status(400).json({ error: "Only PDF files are accepted for CV upload" });
    }
    if (file.length > 15 * 1024 * 1024) {
      return res.status(413).json({ error: "PDF is too large (max ~10MB)" });
    }

    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      const { v2: cloudinary } = await import("cloudinary");
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      const result = await cloudinary.uploader.upload(file, {
        folder: "swaraj_portfolio",
        resource_type: "raw",
        public_id: "Swaraj_Vecha_CV",
        overwrite: true,
        format: "pdf",
      });

      return res.json({
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
        source: "Cloudinary",
      });
    } else {
      return res.json({
        success: true,
        url: file,
        source: "Direct",
        message: "Cloudinary keys not set. CV stored as base64."
      });
    }
  } catch (error) {
    sendServerError(res, "Failed to upload CV", error);
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

// Brute-force login protection: 3 failed attempts → 15 minute lockout per IP
const loginAttempts = new Map(); // ip → { count, lockedUntil }
const MAX_LOGIN_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

const getLoginAttemptInfo = (ip) => {
  const entry = loginAttempts.get(ip);
  if (!entry) return { count: 0, lockedUntil: 0 };
  // If lockout has expired, clear it
  if (entry.lockedUntil && Date.now() > entry.lockedUntil) {
    loginAttempts.delete(ip);
    return { count: 0, lockedUntil: 0 };
  }
  return entry;
};

// POST /api/admin/verify - Lets the Admin UI check a passcode server-side before unlocking
app.post("/api/admin/verify", rateLimit(10, 60 * 1000), async (req, res) => {
  try {
    const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip || "unknown";
    const attempt = getLoginAttemptInfo(ip);

    // Check if IP is currently locked out
    if (attempt.lockedUntil && Date.now() < attempt.lockedUntil) {
      const remainingMs = attempt.lockedUntil - Date.now();
      const remainingMin = Math.ceil(remainingMs / 60000);
      return res.status(429).json({
        success: false,
        error: `Too many failed attempts. Try again in ${remainingMin} minute${remainingMin > 1 ? "s" : ""}.`,
        locked: true,
        lockedUntil: attempt.lockedUntil,
        remainingMs
      });
    }

    const { passcode } = req.body;
    const activePasscode = await getAdminPasscode();

    if (passcode && passcode === activePasscode) {
      // Success — clear failed attempts for this IP
      loginAttempts.delete(ip);
      return res.json({ success: true, message: "Authentication successful" });
    }

    // Failed attempt — increment counter
    const newCount = (attempt.count || 0) + 1;
    const remainingAttempts = MAX_LOGIN_ATTEMPTS - newCount;

    if (newCount >= MAX_LOGIN_ATTEMPTS) {
      // Lock the IP for 15 minutes
      const lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
      loginAttempts.set(ip, { count: newCount, lockedUntil });
      console.warn(`🔒 Admin login locked for IP ${ip} until ${new Date(lockedUntil).toLocaleTimeString()}`);
      return res.status(429).json({
        success: false,
        error: "Too many failed attempts. You are locked out for 15 minutes.",
        locked: true,
        lockedUntil,
        remainingMs: LOCKOUT_DURATION_MS
      });
    }

    // Not locked yet, but track the failure
    loginAttempts.set(ip, { count: newCount, lockedUntil: 0 });
    res.status(401).json({
      success: false,
      error: `Invalid passcode. ${remainingAttempts} attempt${remainingAttempts > 1 ? "s" : ""} remaining before lockout.`,
      locked: false,
      remainingAttempts
    });
  } catch (error) {
    sendServerError(res, "Authentication check failed", error);
  }
});

// POST /api/admin/request-otp - Send 6-digit OTP to swarajvecha@gmail.com for identity verification
app.post("/api/admin/request-otp", rateLimit(5, 10 * 60 * 1000), async (req, res) => {
  try {
    // Generate secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    activeOtpSession = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      attempts: 0,
    };

    const mailResult = await sendOtpEmail(otp);

    res.json({
      success: true,
      message: mailResult.sent
        ? `Security OTP sent to ${ADMIN_NOTIFICATION_EMAIL}. Please check your inbox / spam folder.`
        : `Security OTP generated for ${ADMIN_NOTIFICATION_EMAIL}! Check your email or server console.`,
      email: ADMIN_NOTIFICATION_EMAIL,
      // For immediate dev convenience if SMTP credentials aren't yet added to .env:
      ...(process.env.EMAIL_USER && process.env.EMAIL_PASS ? {} : { devOtp: otp, note: "OTP logged to server terminal" }),
    });
  } catch (error) {
    sendServerError(res, "Failed to generate security OTP", error);
  }
});

// POST /api/admin/change-passcode - Verify OTP and update master admin passkey in MongoDB Atlas
app.post("/api/admin/change-passcode", rateLimit(5, 10 * 60 * 1000), async (req, res) => {
  try {
    const { otp, newPasscode } = req.body;

    if (!activeOtpSession || Date.now() > activeOtpSession.expiresAt) {
      return res.status(400).json({ error: "Verification OTP has expired or was not requested. Please request a new OTP." });
    }

    if (activeOtpSession.attempts >= 5) {
      activeOtpSession = null;
      return res.status(400).json({ error: "Too many failed attempts. Please request a new OTP." });
    }

    if (!otp || otp.toString().trim() !== activeOtpSession.otp) {
      activeOtpSession.attempts += 1;
      return res.status(400).json({ error: `Invalid OTP code. Attempts remaining: ${5 - activeOtpSession.attempts}` });
    }

    if (!newPasscode || typeof newPasscode !== "string" || newPasscode.trim().length < 4) {
      return res.status(400).json({ error: "New passkey must be at least 4 characters long." });
    }

    const cleanedPasscode = newPasscode.trim();

    // 1. Save new passkey in MongoDB Atlas
    const col = mongoose.connection.db.collection("admin_settings");
    await col.updateOne(
      { key: "admin_auth" },
      { $set: { passcode: cleanedPasscode, updatedAt: new Date(), updatedBy: ADMIN_NOTIFICATION_EMAIL } },
      { upsert: true }
    );

    // 2. Update RAM cache immediately
    cachedAdminPasscode = cleanedPasscode;
    lastPasscodeCheck = Date.now();

    // 3. Invalidate OTP session
    activeOtpSession = null;

    console.log(`\n🎉 [ADMIN SECURITY SUCCESS] Admin passkey successfully changed to "${cleanedPasscode}" at ${new Date().toISOString()}\n`);

    res.json({
      success: true,
      message: "Admin passkey changed successfully! You can now log in with your new passkey.",
    });
  } catch (error) {
    sendServerError(res, "Failed to update admin passkey", error);
  }
});

// ============================================================
// VISITOR ANALYTICS TRACKING SYSTEM
// ============================================================

const getVisitorCollection = () => mongoose.connection.db.collection("visitor_logs");

// Simple user-agent parser (no dependency needed)
const parseUserAgent = (ua) => {
  if (!ua) return { device: "Unknown", browser: "Unknown" };
  const device = /Mobile|Android|iPhone|iPad/i.test(ua) ? "Mobile" : /Tablet/i.test(ua) ? "Tablet" : "Desktop";
  let browser = "Other";
  if (/Edg\//i.test(ua)) browser = "Edge";
  else if (/OPR|Opera/i.test(ua)) browser = "Opera";
  else if (/Chrome/i.test(ua)) browser = "Chrome";
  else if (/Firefox/i.test(ua)) browser = "Firefox";
  else if (/Safari/i.test(ua)) browser = "Safari";
  return { device, browser };
};

// POST /api/track-visit - Log a visitor with IP-based geolocation (public, rate-limited)
app.post("/api/track-visit", rateLimit(10, 60 * 1000), async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not ready" });
    }

    const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip || "unknown";
    const ua = req.headers["user-agent"] || "unknown";
    const { device, browser } = parseUserAgent(ua);
    const referrer = req.headers["referer"] || req.headers["referrer"] || "";
    const page = req.body?.page || "/";

    // IP Geolocation via free ip-api.com (no key needed, 45 req/min)
    let geo = { city: "Unknown", region: "", country: "Unknown", timezone: "" };
    try {
      // Use the real client IP; for localhost/dev use a fallback
      const lookupIp = (ip === "::1" || ip === "127.0.0.1" || ip === "unknown") ? "" : ip;
      const geoUrl = lookupIp ? `http://ip-api.com/json/${lookupIp}?fields=city,regionName,countryCode,timezone` : `http://ip-api.com/json/?fields=city,regionName,countryCode,timezone`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const geoRes = await fetch(geoUrl, { signal: controller.signal });
      clearTimeout(timeout);
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData.city) geo.city = geoData.city;
        if (geoData.regionName) geo.region = geoData.regionName;
        if (geoData.countryCode) geo.country = geoData.countryCode;
        if (geoData.timezone) geo.timezone = geoData.timezone;
      }
    } catch {
      // Geolocation failed silently — we still log the visit
    }

    const visitorDoc = {
      ip: ip.replace(/::ffff:/g, ""),
      city: geo.city,
      region: geo.region,
      country: geo.country,
      timezone: geo.timezone,
      userAgent: ua.substring(0, 500),
      device,
      browser,
      referrer: referrer.substring(0, 500),
      page,
      visitedAt: new Date()
    };

    const col = getVisitorCollection();
    await col.insertOne(visitorDoc);

    console.log(`👁️ Visitor: ${geo.city}, ${geo.country} | ${device}/${browser} | ${new Date().toLocaleTimeString()}`);
    res.json({ success: true });
  } catch (error) {
    // Silently fail — visitor tracking should never break the site
    console.error("Visitor tracking error:", error.message);
    res.json({ success: false });
  }
});

// GET /api/analytics/visitors - Admin-only: aggregated visitor analytics
app.get("/api/analytics/visitors", requireAdmin, async (req, res) => {
  try {
    const col = getVisitorCollection();
    const now = new Date();

    // Time boundaries
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Sunday of current week
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Parallel count queries
    const [totalCount, todayCount, weekCount, monthCount] = await Promise.all([
      col.countDocuments({}),
      col.countDocuments({ visitedAt: { $gte: todayStart } }),
      col.countDocuments({ visitedAt: { $gte: weekStart } }),
      col.countDocuments({ visitedAt: { $gte: monthStart } }),
    ]);

    // Daily counts for the last 30 days (for chart)
    const thirtyDaysAgo = new Date(todayStart);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

    const dailyPipeline = [
      { $match: { visitedAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$visitedAt" },
            month: { $month: "$visitedAt" },
            day: { $dayOfMonth: "$visitedAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ];
    const dailyRaw = await col.aggregate(dailyPipeline).toArray();

    // Fill in zero-count days for the last 30 days
    const dailyCounts = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(thirtyDaysAgo);
      d.setDate(d.getDate() + i);
      const match = dailyRaw.find(
        (r) => r._id.year === d.getFullYear() && r._id.month === d.getMonth() + 1 && r._id.day === d.getDate()
      );
      dailyCounts.push({
        date: d.toISOString().split("T")[0],
        label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        count: match ? match.count : 0
      });
    }

    // Top 5 locations
    const topLocations = await col.aggregate([
      { $match: { city: { $ne: "Unknown" } } },
      { $group: { _id: { city: "$city", country: "$country" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, city: "$_id.city", country: "$_id.country", count: 1 } }
    ]).toArray();

    // Device breakdown
    const deviceBreakdown = await col.aggregate([
      { $group: { _id: "$device", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();

    // Paginated visitors list (default: page 1, 15 per page)
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 15));
    const skip = (page - 1) * limit;

    const recentVisitors = await col.find({})
      .sort({ visitedAt: -1 })
      .skip(skip)
      .limit(limit)
      .project({ ip: 0, userAgent: 0 })
      .toArray();

    // Convert _id to string for frontend
    const visitors = recentVisitors.map((v) => ({ ...v, _id: v._id.toString() }));
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      success: true,
      summary: { total: totalCount, today: todayCount, thisWeek: weekCount, thisMonth: monthCount },
      dailyCounts,
      topLocations,
      deviceBreakdown: deviceBreakdown.map((d) => ({ device: d._id || "Unknown", count: d.count })),
      visitors,
      pagination: { page, limit, totalPages, totalRecords: totalCount }
    });
  } catch (error) {
    sendServerError(res, "Failed to fetch analytics", error);
  }
});

// DELETE /api/analytics/visitors/:id - Admin-only: delete a single visitor log
app.delete("/api/analytics/visitors/:id", requireAdmin, async (req, res) => {
  try {
    const { ObjectId } = await import("mongodb");
    const col = getVisitorCollection();
    const result = await col.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Visitor record not found" });
    }
    res.json({ success: true, message: "Visitor record deleted" });
  } catch (error) {
    sendServerError(res, "Failed to delete visitor record", error);
  }
});

// DELETE /api/analytics/visitors - Admin-only: clear ALL visitor logs
app.delete("/api/analytics/visitors", requireAdmin, async (req, res) => {
  try {
    const col = getVisitorCollection();
    const result = await col.deleteMany({});
    res.json({ success: true, message: `Cleared ${result.deletedCount} visitor records` });
  } catch (error) {
    sendServerError(res, "Failed to clear visitor logs", error);
  }
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
  app.listen(PORT, () => {
    console.log(`🚀 Production High-Performance API Server running on port ${PORT}`);
  });

  try {
    console.log("Connecting to MongoDB Atlas Cluster with Connection Pooling...");
    await mongoose.connect(MONGODB_URI, {
      family: 4,
      serverSelectionTimeoutMS: 8000,
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000
    });
    console.log("Connected successfully to MongoDB Atlas!");
  } catch (err) {
    console.warn("Notice: Initial MongoDB connection delayed. Server is running and will retry automatically:", err.message);
  }
};

startServer();
