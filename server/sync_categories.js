import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
    const col = mongoose.connection.db.collection("portfolios");
    const doc = await col.findOne({ key: "main_portfolio" });

    if (doc && doc.projects?.cards) {
      doc.projects.cards[0].category = "FinTech & Trading";
      doc.projects.cards[1].category = "Cloud & DevOps";
      doc.projects.cards[2].category = "AI / ML & GPT";
      if (doc.projects.cards[3]) {
        doc.projects.cards[3].category = "Full Stack & Web";
      }

      await col.updateOne({ key: "main_portfolio" }, { $set: { ...doc, updatedAt: new Date() } });
      console.log("✅ MongoDB Atlas updated with clean categories!");
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
