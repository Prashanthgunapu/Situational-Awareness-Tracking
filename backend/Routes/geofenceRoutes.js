const express = require("express");
const authenticateUser = require("../middleware/authMiddleware");
const Geofence = require("../models/Geofence");
const Location = require("../models/Location");
const Group = require("../models/Group");

const router = express.Router();

// ✅ Personal Geofence
router.post("/set", authenticateUser, async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.body;
    const userId = req.user.id;

    const geofence = new Geofence({ user: userId, latitude, longitude, radius });
    await geofence.save();

    res.json({ message: "Personal geofence set", geofence });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/check", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;

    const lastLocation = await Location.findOne({ user: userId }).sort({ timestamp: -1 });
    if (!lastLocation) return res.status(404).json({ message: "No location data found" });

    const geofence = await Geofence.findOne({ user: userId });
    if (!geofence) return res.status(404).json({ message: "No geofence set" });

    const distance = getDistanceFromLatLonInMeters(
      geofence.latitude, geofence.longitude,
      lastLocation.latitude, lastLocation.longitude
    );

    const status = distance > geofence.radius
      ? "🚨 OUTSIDE geofence"
      : "✅ INSIDE geofence";

    res.json({ message: status, distance });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Shared Group Geofence
router.post("/group/set", authenticateUser, async (req, res) => {
  try {
    const { groupId, latitude, longitude, radius } = req.body;

    // Remove old shared geofence for group
    await Geofence.deleteMany({ group: groupId });

    const geofence = new Geofence({ group: groupId, latitude, longitude, radius });
    await geofence.save();

    res.json({ message: "Shared geofence set for group", geofence });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/group/check/:groupId", authenticateUser, async (req, res) => {
  try {
    const groupId = req.params.groupId;

    const geofence = await Geofence.findOne({ group: groupId });
    if (!geofence) return res.status(404).json({ message: "No shared geofence found" });

    const group = await Group.findById(groupId).populate("users");
    if (!group) return res.status(404).json({ message: "Group not found" });

    const alerts = [];

    for (const user of group.users) {
      const loc = await Location.findOne({ user: user._id }).sort({ timestamp: -1 });
      if (!loc) continue;

      const dist = getDistanceFromLatLonInMeters(
        geofence.latitude, geofence.longitude,
        loc.latitude, loc.longitude
      );

      if (dist > geofence.radius) {
        alerts.push({ user: user.username, status: "🚨 Outside", distance: dist });
      }
    }

    res.json({ message: "Geofence check complete", alerts });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// 📐 Utility function
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

module.exports = router;
