// backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orderRoutes");

dotenv.config();

const app = express();

// ✅ CORS configuration
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL,
    "https://e-com-ecru-seven.vercel.app",
    "http://localhost:8080",
    "http://localhost:8081",
  ].filter(Boolean),
  credentials: true,
};
app.use(cors(corsOptions));

// ✅ Middleware
app.use(express.json());

// ✅ Connect MongoDB
connectDB();

// ✅ Base route
app.get("/", (req, res) => {
  res.send("✅ Backend running...");
});

// ✅ API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
