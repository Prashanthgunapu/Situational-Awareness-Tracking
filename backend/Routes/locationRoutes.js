const express = require("express");
const authenticateUser = require("../middleware/authMiddleware");
const Location = require("../models/Location");

const router = express.Router();

// ✅ Update user location
router.post("/update", authenticateUser, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const userId = req.user.id;

    console.log("📥 Received location:", latitude, longitude);

    const location = new Location({ user: userId, latitude, longitude });
    await location.save();

    res.json({ message: "Location updated successfully", location });
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get latest location for user
router.get("/:userId", authenticateUser, async (req, res) => {
  try {
    const location = await Location.findOne({ user: req.params.userId }).sort({ timestamp: -1 });
    if (!location) return res.status(404).json({ message: "No location found" });

    res.json(location);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
