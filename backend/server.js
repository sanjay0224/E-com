const express = require("express");
const cors = require("cors"); //cross platform sharing
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");

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

//server starting indication
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
