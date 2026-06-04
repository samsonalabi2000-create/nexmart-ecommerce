const express    = require("express");
const router     = express.Router();
const ctrl       = require("../controllers/orders");
const { protect} = require("../middleware/auth");

router.use(protect); // all order routes require login

router.get ("/",    ctrl.getOrders);
router.post("/",    ctrl.createOrder);
router.get ("/:id", ctrl.getById);

module.exports = router;
