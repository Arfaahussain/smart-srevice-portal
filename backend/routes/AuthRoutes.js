import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

const router = express.Router();

/* =========================================
   REGISTER (TEST ONLY)
========================================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json("All fields required");
    }

    // Check existing user
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json("Email already registered");
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashed,
      role: "user"        // default
    });

    await user.save();

    res.status(201).json("User Created");

  } catch (err) {
    res.status(500).json("Registration failed");
  }
});

/* =========================================
   LOGIN  (ADMIN ONLY)
========================================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json("Email & password required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json("Invalid credentials");
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json("Invalid credentials");
    }

    // 👉 ADMIN CHECK
    if (user.role !== "admin") {
      return res.status(403).json("Admin access required");
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      "secret123",
      { expiresIn: "8h" }
    );

    res.json({
      token,
      role: user.role,
      email: user.email,
      name: user.name
    });

  } catch (err) {
    res.status(500).json("Login failed");
  }
});

export default router;
