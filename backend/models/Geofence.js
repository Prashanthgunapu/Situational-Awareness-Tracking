const mongoose = require("mongoose");

const GeofenceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: false },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  radius: { type: Number, required: true } // Radius in meters
});

// Ensure either user or group is set
GeofenceSchema.pre("save", function (next) {
  if (!this.user && !this.group) {
    return next(new Error("Geofence must be associated with either a user or a group."));
  }
  next();
});

module.exports = mongoose.model("Geofence", GeofenceSchema);
