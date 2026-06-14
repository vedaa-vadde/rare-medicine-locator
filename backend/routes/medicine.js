const express = require("express");
const router = express.Router();
const {
  searchMedicines,
  getNearbyMedicines,
  getMyMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
} = require("../controllers/medicineController");
const { protect, pharmacyOnly } = require("../middleware/auth");

// Public routes
router.get("/search", searchMedicines);
router.get("/nearby", getNearbyMedicines);

// Pharmacy-only routes
router.get("/my", protect, pharmacyOnly, getMyMedicines);
router.post("/", protect, pharmacyOnly, addMedicine);
router.put("/:id", protect, pharmacyOnly, updateMedicine);
router.delete("/:id", protect, pharmacyOnly, deleteMedicine);

module.exports = router;
