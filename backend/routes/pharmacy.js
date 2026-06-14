const express = require("express");
const router = express.Router();
const {
  getAllPharmacies,
  getPharmacyMedicines,
  getDashboardStats,
} = require("../controllers/pharmacyController");
const { protect, pharmacyOnly } = require("../middleware/auth");

router.get("/", getAllPharmacies);
router.get("/dashboard", protect, pharmacyOnly, getDashboardStats);
router.get("/:id/medicines", getPharmacyMedicines);

module.exports = router;
