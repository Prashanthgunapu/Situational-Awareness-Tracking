// offlineTrackingRoutes.js – Smart Prediction with Historical Path Analysis 🧠
const express = require("express");
const authenticateUser = require("../middleware/authMiddleware");
const Location = require("../models/Location");
const router = express.Router();

// Predict next location based on velocity vector
router.get("/predict", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const points = await Location.find({ user: userId }).sort({ timestamp: -1 }).limit(3);

    if (points.length < 2) {
      // Add mock data if no real history exists
      const mock = [
        { latitude: 42.2621, longitude: -71.8011, user: userId },
        { latitude: 42.2629, longitude: -71.8000, user: userId }
      ];
      await Location.insertMany(mock);
      return res.json({ message: "🔧 Mock data inserted. Try prediction again." });
    }

    const [latest, previous] = points;
    const deltaLat = latest.latitude - previous.latitude;
    const deltaLon = latest.longitude - previous.longitude;

    const predictedLat = latest.latitude + deltaLat;
    const predictedLon = latest.longitude + deltaLon;

    res.json({
      secondLastLat: previous.latitude,
      secondLastLon: previous.longitude,
      predictedLat,
      predictedLon
    });
  } catch (error) {
    console.error("Prediction error:", error);
    res.status(500).json({ message: "Prediction failed" });
  }
});

module.exports = router;
