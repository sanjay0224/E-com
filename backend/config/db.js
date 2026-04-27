const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb+srv://adminUser:adminUser@cluster0.bzh7gi1.mongodb.net";
    await mongoose.connect(uri); // modern driver: no extra options needed
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ DB Connection Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
