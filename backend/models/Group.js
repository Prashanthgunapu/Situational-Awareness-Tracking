const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // References users in the group
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Group", GroupSchema);
