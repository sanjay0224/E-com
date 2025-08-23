const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Test Route
app.get("/", (req, res) => {
  res.send("✅ Backend running...");
});

// Routes
app.use("/api/auth", require("./routes/auth"));   // e.g., POST /api/auth/signup
app.use("/api/products", productRoutes); // e.g., POST /api/products
app.use("/api/cart", cartRoutes);        // e.g., POST /api/cart

// Start Server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
