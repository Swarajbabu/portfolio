import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });
dotenv.config({ path: path.join(__dirname, ".env") });

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const mongoUri = process.env.MONGODB_URI;

if (!cloudName || !apiKey || !apiSecret) {
  console.error("❌ ERROR: Cloudinary credentials missing in .env!");
  console.log("Please provide:");
  console.log("CLOUDINARY_CLOUD_NAME=your_cloud_name");
  console.log("CLOUDINARY_API_KEY=your_api_key");
  console.log("CLOUDINARY_API_SECRET=your_api_secret");
  process.exit(1);
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

const uploadImage = async (filePath, folder = "swaraj_portfolio") => {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return null;
  }
  console.log(`Uploading ${path.basename(filePath)} to Cloudinary...`);
  const res = await cloudinary.uploader.upload(filePath, {
    folder: folder,
    resource_type: "image",
    use_filename: true,
    unique_filename: true,
  });
  console.log(`✅ Uploaded: ${res.secure_url}`);
  return res.secure_url;
};

const run = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUri, { family: 4 });
    console.log("Connected to MongoDB Atlas.");

    const assetsDir = path.join(__dirname, "../src/assets");

    // Upload local assets to Cloudinary
    const heroUrl = await uploadImage(path.join(assetsDir, "swaraj-hero.jpg"));
    const tradexUrl = await uploadImage(path.join(assetsDir, "tradex-preview.jpg"));
    const wanderlustUrl = await uploadImage(path.join(assetsDir, "wanderlust-preview.jpg"));
    const quickcodeUrl = await uploadImage(path.join(assetsDir, "quickcode-preview.jpg"));
    const autoCertUrl = await uploadImage(path.join(assetsDir, "auto.png"));

    const col = mongoose.connection.db.collection("portfolios");
    const doc = await col.findOne({ key: "main_portfolio" });

    if (doc) {
      if (tradexUrl && doc.projects?.cards?.[0]) doc.projects.cards[0].image = tradexUrl;
      if (wanderlustUrl && doc.projects?.cards?.[1]) doc.projects.cards[1].image = wanderlustUrl;
      if (quickcodeUrl && doc.projects?.cards?.[2]) doc.projects.cards[2].image = quickcodeUrl;
      if (autoCertUrl && doc.experience?.items) {
        doc.experience.items.forEach((item) => {
          item.image = autoCertUrl;
        });
      }

      await col.updateOne(
        { key: "main_portfolio" },
        { $set: { ...doc, updatedAt: new Date() } }
      );
      console.log("🎉 All Cloudinary image URLs saved to MongoDB Atlas database successfully!");
    }

    process.exit(0);
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
};

run();
