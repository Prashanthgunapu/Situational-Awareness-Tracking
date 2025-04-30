const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticateUser = require("../middleware/authMiddleware");
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();

// 📌 User Registration (Signup)
router.post("/register", async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({ username, email, password: hashedPassword, role: role || "user" });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// 📌 User Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // ✅ Send token and user details
        res.json({
            token,
            user: {
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// 📌 Protected Profile Route
router.get("/profile", authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// 📌 Forgot Password - Send Reset Link
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Generate reset token (expires in 15 minutes)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

        // 📩 Send reset link via email using Nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetLink = `http://localhost:3000/reset-password/${token}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset Request",
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
        });

        res.json({ message: "Password reset link sent to email." });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// 📌 Reset Password - Update Password
router.post("/reset-password/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

        res.json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ message: "Invalid or expired token" });
    }
});

module.exports = router;
