
const express = require("express");
const authenticateUser = require("../middleware/authMiddleware");
const Group = require("../models/Group");
const User = require("../models/User");
const Location = require("../models/Location");

const router = express.Router();

// Create a new group
router.post("/create", authenticateUser, async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    const group = new Group({ name, users: [userId] });
    await group.save();

    res.json({ message: "Group created successfully", group });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add user to group
router.post("/add", authenticateUser, async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    let group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (!group.users.includes(userId)) {
      group.users.push(userId);
      await group.save();
    }

    res.json({ message: "User added to group", group });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all groups for a user
router.get("/my-groups", authenticateUser, async (req, res) => {
  try {
    const groups = await Group.find({ users: req.user.id }).populate("users", "username email");
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 📍 Get latest locations of users in a group
router.get("/:groupId/locations", authenticateUser, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId).populate("users", "username email");
    if (!group) return res.status(404).json({ message: "Group not found" });

    const locations = await Promise.all(group.users.map(async (user) => {
      const loc = await Location.findOne({ user: user._id }).sort({ timestamp: -1 });
      return loc ? {
        userId: user._id,
        username: user.username,
        latitude: loc.latitude,
        longitude: loc.longitude,
        timestamp: loc.timestamp
      } : null;
    }));

    res.json(locations.filter(Boolean));
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
