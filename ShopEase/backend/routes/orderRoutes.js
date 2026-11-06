const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Product = require("../models/Product");

// Place a new order
router.post("/", async (req, res) => {
  try {
    const {
      customerName,
      phone,
      address,
      city,
      pincode,
      items,
    } = req.body;

    if (
      !customerName ||
      !phone ||
      !address ||
      !city ||
      !pincode ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        message: "Please provide all required details.",
      });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: "Product not found.",
        });
      }

      const quantity = Number(item.quantity);

      if (
        !Number.isInteger(quantity) ||
        quantity <= 0 ||
        quantity > product.stock
      ) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}.`,
        });
      }

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
      });

      totalAmount += product.price * quantity;

      product.stock -= quantity;
      await product.save();
    }

    const newOrder = new Order({
      customerName,
      phone,
      address,
      city,
      pincode,
      items: orderItems,
      totalAmount,
      paymentMethod: "COD",
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order placed successfully!",
      order: newOrder,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to place order.",
    });
  }
});

// Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json(orders);
    } catch (error) {
    console.error("ORDER PLACEMENT ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
});

// Get orders by customer phone number
router.get("/my/:phone", async (req, res) => {
  try {
    const orders = await Order.find({
      phone: req.params.phone
    }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to fetch your orders."
    });
  }
});
module.exports = router;