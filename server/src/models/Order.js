const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [{
      product:      { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name:         String,
      price:        Number,
      quantity:     Number,
      image:        String,
    }],
    shipping: {
      firstName: String, lastName: String,
      email: String, phone: String,
      address: String, city: String, state: String, zip: String,
    },
    payment: {
      method:        { type: String, enum: ["card", "transfer", "crypto"], default: "card" },
      status:        { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
      transactionId: String,
    },
    subtotal:        { type: Number, required: true },
    shippingFee:     { type: Number, default: 0 },
    tax:             { type: Number, default: 0 },
    total:           { type: Number, required: true },
    status:          { type: String, enum: ["processing","shipped","delivered","cancelled"], default: "processing" },
    trackingNumber:  { type: String },
  },
  { timestamps: true }
);

// Auto-generate tracking number
orderSchema.pre("save", function (next) {
  if (!this.trackingNumber) {
    this.trackingNumber = "NX" + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
