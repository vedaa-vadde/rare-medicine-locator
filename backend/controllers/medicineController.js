const Medicine = require("../models/Medicine");
const { sendLowStockAlert } = require("../config/mailer");

// @route GET /api/medicines/search?q=paracetamol&category=tablet
const searchMedicines = async (req, res) => {
  try {
    const { q, category, available } = req.query;
    const query = {};

    if (q) query.$text = { $search: q };
    if (category) query.category = category;
    if (available === "true") query.isAvailable = true;

    const medicines = await Medicine.find(query)
      .populate("pharmacy", "pharmacyName address phone location")
      .sort({ stock: -1 });

    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/medicines/nearby?lat=17.3&lng=78.4&radius=5000
const getNearbyMedicines = async (req, res) => {
  try {
    const { lat, lng, radius = 5000, q } = req.query;

    if (!lat || !lng) return res.status(400).json({ message: "lat and lng are required" });

    // Get pharmacies within radius
    const User = require("../models/User");
    const nearbyPharmacies = await User.find({
      role: "pharmacy",
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(radius),
        },
      },
    }).select("_id");

    const pharmacyIds = nearbyPharmacies.map((p) => p._id);

    const query = { pharmacy: { $in: pharmacyIds }, isAvailable: true };
    if (q) query.$text = { $search: q };

    const medicines = await Medicine.find(query).populate(
      "pharmacy",
      "pharmacyName address phone location"
    );

    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/medicines/my  (pharmacy's own medicines)
const getMyMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ pharmacy: req.user._id }).sort({ createdAt: -1 });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/medicines
const addMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.create({ ...req.body, pharmacy: req.user._id });

    // Emit real-time event to all connected clients
    req.io.emit("medicine:added", {
      pharmacyId: req.user._id,
      pharmacyName: req.user.pharmacyName,
      medicine: { name: medicine.name, stock: medicine.stock },
    });

    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/medicines/:id
const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findOne({ _id: req.params.id, pharmacy: req.user._id });
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });

    const previousStock = medicine.stock;
    Object.assign(medicine, req.body);
    await medicine.save();

    // Emit real-time stock update
    req.io.emit("medicine:stockUpdated", {
      medicineId: medicine._id,
      medicineName: medicine.name,
      pharmacyId: req.user._id,
      pharmacyName: req.user.pharmacyName,
      stock: medicine.stock,
    });

    // Send low stock email alert if stock just dropped below threshold
    const droppedBelowThreshold =
      previousStock >= medicine.lowStockThreshold &&
      medicine.stock < medicine.lowStockThreshold;

    if (droppedBelowThreshold) {
      try {
        await sendLowStockAlert(
          req.user.email,
          req.user.pharmacyName,
          medicine.name,
          medicine.stock
        );
      } catch (emailErr) {
        console.error("Email alert failed:", emailErr.message);
      }
    }

    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/medicines/:id
const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findOneAndDelete({
      _id: req.params.id,
      pharmacy: req.user._id,
    });
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });

    req.io.emit("medicine:deleted", { medicineId: req.params.id });

    res.json({ message: "Medicine removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  searchMedicines,
  getNearbyMedicines,
  getMyMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
};
