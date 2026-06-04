const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    rating:   { type: Number, required: true, min: 1, max: 5 },
    comment:  { type: String, required: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    description:  { type: String, required: true },
    price:        { type: Number, required: true, min: 0 },
    originalPrice:{ type: Number, default: null },
    category:     { type: String, required: true, index: true },
    categoryName: { type: String, required: true },
    brand:        { type: String, required: true, index: true },
    images:       [{ type: String }],
    badge:        { type: String, enum: ["sale", "new", "hot", null], default: null },
    isNew:        { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    stock:        { type: Number, required: true, min: 0, default: 0 },
    specs:        { type: Map, of: String },
    tags:         [{ type: String }],
    rating:       { type: Number, default: 0 },
    reviewCount:  { type: Number, default: 0 },
    reviews:      [reviewSchema],
  },
  { timestamps: true }
);

// Recalculate rating when reviews change
productSchema.methods.updateRating = function () {
  if (this.reviews.length === 0) { this.rating = 0; this.reviewCount = 0; return; }
  this.reviewCount = this.reviews.length;
  this.rating = this.reviews.reduce((s, r) => s + r.rating, 0) / this.reviewCount;
};

module.exports = mongoose.model("Product", productSchema);
