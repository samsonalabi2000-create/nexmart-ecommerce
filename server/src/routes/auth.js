// routes/auth.js
const express    = require("express");
const router     = express.Router();
const ctrl       = require("../controllers/auth");
const { protect} = require("../middleware/auth");

router.post("/register", ctrl.register);
router.post("/login",    ctrl.login);
router.post("/logout",   ctrl.logout);
router.get ("/me",       protect, ctrl.getMe);
router.put ("/profile",  protect, ctrl.updateProfile);

module.exports = router;
