import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

const router = express.Router();

// REGISTER (for testing)
router.post("/register", async (req, res) => {

  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashed
  });

  await user.save();

  res.json("User Created");
});

// LOGIN
router.post("/login", async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json("User not found");
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return res.status(400).json("Wrong password");
  }

  if (user.role !== "admin") {
    return res.status(403).json("Admin access only");
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    "secret123"
  );

  res.json({ token, role: user.role });

});

export default router;
