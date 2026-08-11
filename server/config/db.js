import mongoose from "mongoose";

export async function connectDatabase() {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("MONGO_URI is not configured.");
      return;
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("ForgeIntel database connected");
  } catch (error) {
    console.error(
      "Database connection failed:",
      error.message
    );

    process.exit(1);
  }
}