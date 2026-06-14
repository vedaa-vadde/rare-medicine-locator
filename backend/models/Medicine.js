const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    genericName: { type: String, trim: true },
    category: { type: String, required: true },
    description: { type: String },
    manufacturer: { type: String },
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    stock: { type: Number, required: true, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    price: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    requiresPrescription: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Text index for search
medicineSchema.index({ name: "text", genericName: "text", category: "text" });

module.exports = mongoose.model("Medicine", medicineSchema);
