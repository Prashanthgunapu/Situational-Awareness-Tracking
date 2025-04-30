// alertRoutes.js - Emergency Alert Route with fetchable latest alert 🚨
const express = require("express");
const authenticateUser = require("../middleware/authMiddleware");
const router = express.Router();

let latestAlertStore = {}; // Simple in-memory store by groupId

// POST /alerts/send
router.post("/send", authenticateUser, async (req, res) => {
  const { groupId, message } = req.body;
  if (!groupId || !message) {
    return res.status(400).json({ alertMessage: "Group and message required" });
  }

  const alert = {
    groupId,
    message,
    timestamp: new Date().toISOString(),
  };
  latestAlertStore[groupId] = alert;

  console.log(`🚨 Emergency Alert to Group ${groupId}: ${message}`);
  res.json({ alertMessage: `🚨 Alert sent to group ${groupId}` });
});

// GET /alerts/:groupId
router.get("/:groupId", authenticateUser, async (req, res) => {
  const { groupId } = req.params;
  const alert = latestAlertStore[groupId];
  if (!alert) return res.json({ latestAlert: null });
  res.json({ latestAlert: alert });
});

module.exports = router;
