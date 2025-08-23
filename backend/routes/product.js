const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// POST /api/products
router.post("/", async (req, res) => {
  try {
    const { name, price, description } = req.body;
    if (!name || price == null) return res.status(400).json({ message: "name and price required" });

    const product = await Product.create({ name, price, description });
    return res.status(201).json(product);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET /api/products
router.get("/", async (_req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  return res.json(products);
});

module.exports = router;
