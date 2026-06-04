const express    = require("express");
const router     = express.Router();
const ctrl       = require("../controllers/products");
const { protect} = require("../middleware/auth");

// Static routes MUST come before /:id
router.get("/best-sellers", ctrl.getBestSellers);
router.get("/new-arrivals", ctrl.getNewArrivals);
router.get("/flash-sales",  ctrl.getFlashSales);
router.get("/search",       ctrl.search);

// Dynamic routes
router.get("/",             ctrl.getAll);
router.get("/:id",          ctrl.getById);
router.get("/:id/related",  ctrl.getRelated);
router.post("/:id/reviews", protect, ctrl.addReview);

module.exports = router;
