// backend/routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Create new order
router.post("/", async (req, res) => {
  console.log("Incoming order:", req.body); // Debugging
  try {
    const { userId, items, totalAmount, address } = req.body;

    // Basic validation
    if (!userId || !items || !items.length || !totalAmount || !address) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Ensure items have productId, name, and quantity
    const formattedItems = items.map(item => ({
      productId: item.productId || item._id,
      name: item.name,
      quantity: item.quantity
    }));

    const newOrder = new Order({
      userId,
      items: formattedItems,
      totalAmount,
      address,
    });

    await newOrder.save();

    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error("❌ Order creation failed:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

module.exports = router;
