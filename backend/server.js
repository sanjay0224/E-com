const express = require("express");
const cors = require("cors"); //cross platform sharing
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");

const path = require("path"); // added for serving frontend

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("✅ Backend running...");
});

// Routes
app.use("/api/auth", require("./routes/auth"));   
app.use("/api/products", productRoutes); 
app.use("/api/cart", cartRoutes);     

// Serve Vue frontend (optional)
app.use(express.static(path.join(__dirname, "frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
});

//server starting indication
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
