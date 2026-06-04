const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true, trim: true },
    email:         { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:      { type: String, required: true, minlength: 6, select: false },
    phone:         { type: String, default: "" },
    avatar:        { type: String, default: "" },
    role:          { type: String, enum: ["user", "admin"], default: "user" },
    loyaltyPoints: { type: Number, default: 0 },
    addresses:     [{ label: String, street: String, city: String, state: String, zip: String, isDefault: Boolean }],
    wishlist:      [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", userSchema);
