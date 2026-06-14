const User = require("../models/User");
const Medicine = require("../models/Medicine");

// @route GET /api/pharmacies
const getAllPharmacies = async (req, res) => {
  try {
    const pharmacies = await User.find({ role: "pharmacy" }).select(
      "pharmacyName address phone location createdAt"
    );
    res.json(pharmacies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/pharmacies/:id/medicines
const getPharmacyMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({
      pharmacy: req.params.id,
      isAvailable: true,
    });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/pharmacies/dashboard  (pharmacy's stats)
const getDashboardStats = async (req, res) => {
  try {
    const medicines = await Medicine.find({ pharmacy: req.user._id });

    const totalMedicines = medicines.length;
    const totalStock = medicines.reduce((sum, m) => sum + m.stock, 0);
    const lowStockItems = medicines.filter((m) => m.stock < m.lowStockThreshold);
    const outOfStock = medicines.filter((m) => m.stock === 0);

    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const expiringSoon = medicines.filter(
      (m) => new Date(m.expiryDate) <= thirtyDaysFromNow && new Date(m.expiryDate) > today
    );

    res.json({
      totalMedicines,
      totalStock,
      lowStockCount: lowStockItems.length,
      outOfStockCount: outOfStock.length,
      expiringSoonCount: expiringSoon.length,
      lowStockItems,
      expiringSoonItems: expiringSoon,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllPharmacies, getPharmacyMedicines, getDashboardStats };
