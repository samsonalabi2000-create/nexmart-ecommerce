const Order   = require("../models/Order");
const User    = require("../models/User");

// GET /api/orders  (my orders)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/orders/:id
exports.getById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { items, shipping, payment, subtotal, shippingFee, tax, total } = req.body;

    const order = await Order.create({
      user: req.user._id,
      items,
      shipping,
      payment,
      subtotal,
      shippingFee,
      tax,
      total,
    });

    // Add loyalty points (1 point per ₦100 spent)
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { loyaltyPoints: Math.floor(total / 100) },
    });

    res.status(201).json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
