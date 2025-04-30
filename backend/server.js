const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./Routes/authRoutes"); // Import authentication routes
const locationRoutes = require("./Routes/locationRoutes"); // Import location tracking routes
const geofenceRoutes = require("./Routes/geofenceRoutes"); // Import geofencing routes
const routeOptimizationRoutes = require("./Routes/routeOptimizationRoutes"); // Import AI route optimization
const groupRoutes = require("./Routes/groupRoutes"); // Import group management routes
const alertRoutes = require("./Routes/alertRoutes"); // Import emergency alerts routes
const offlineTrackingRoutes = require("./Routes/offlineTrackingRoutes"); // Import offline tracking routes

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.error("❌ MongoDB Connection Error: ", err));

// Default route
app.get("/", (req, res) => {
    res.send("✅ Backend API is running...");
});

// Registering API Routes
app.use("/auth", authRoutes);
app.use("/location", locationRoutes);
app.use("/geofence", geofenceRoutes);
app.use("/route", routeOptimizationRoutes);
app.use("/groups", groupRoutes);
app.use("/alerts", alertRoutes);
app.use("/offline-tracking", offlineTrackingRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
