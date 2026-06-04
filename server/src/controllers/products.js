const Product = require("../models/Product");

// GET /api/products
exports.getAll = async (req, res) => {
  try {
    const { category, search, sort, brand, minPrice, maxPrice, rating, page = 1, limit = 12 } = req.query;
    const query = {};

    if (category)  query.category = category;
    if (brand)     query.brand    = new RegExp(brand, "i");
    if (search)    query.name     = new RegExp(search, "i");
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (rating)    query.rating = { $gte: Number(rating) };

    const sortMap = {
      "price-asc":  { price:  1 },
      "price-desc": { price: -1 },
      "rating":     { rating: -1 },
      "newest":     { createdAt: -1 },
      "popular":    { reviewCount: -1 },
    };
    const sortObj = sortMap[sort] || { reviewCount: -1 };

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sortObj).skip(skip).limit(Number(limit)).select("-reviews");

    res.json({ products, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/best-sellers
exports.getBestSellers = async (req, res) => {
  try {
    const products = await Product.find({ isBestSeller: true }).limit(8).select("-reviews");
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/products/new-arrivals
exports.getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({ isNew: true }).sort({ createdAt: -1 }).limit(8).select("-reviews");
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/products/flash-sales
exports.getFlashSales = async (req, res) => {
  try {
    const products = await Product.find({ badge: "sale" }).limit(6).select("-reviews");
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/products/:id
exports.getById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/products/:id/related
exports.getRelated = async (req, res) => {
  try {
    const product  = await Product.findById(req.params.id).select("category");
    if (!product)  return res.status(404).json({ message: "Not found" });
    const related  = await Product.find({ category: product.category, _id: { $ne: req.params.id } })
      .limit(6).select("-reviews");
    res.json(related);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/products/search?q=
exports.search = async (req, res) => {
  try {
    const products = await Product.find({
      name: new RegExp(req.query.q, "i"),
    }).limit(8).select("name price images category rating");
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/products/:id/reviews  (protected)
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const already = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
    if (already) return res.status(400).json({ message: "You already reviewed this product" });

    product.reviews.push({ user: req.user._id, userName: req.user.name, rating, comment, verified: true });
    product.updateRating();
    await product.save();
    res.status(201).json(product.reviews[product.reviews.length - 1]);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
