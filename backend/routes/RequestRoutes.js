import express from "express";
import { requireAdmin } from "../middleware/AuthMiddleware.js";
import Request from "../models/Request.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const router = express.Router();

/* =========================================
   CREATE REQUEST
========================================= */
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      requesterName,
      requesterEmail
    } = req.body;

    // Basic validation
    if (!title || !description || !requesterName || !requesterEmail) {
      return res.status(400).json("Required fields missing");
    }

    const request = new Request(req.body);
    await request.save();

    res.status(201).json(request);

  } catch (err) {
    console.error("Create request error:", err);
    res.status(500).json("Server error while creating request");
  }
});

/* =========================================
   GET ALL WITH FILTERS
========================================= */
router.get("/", requireAdmin, async (req, res) => {
  try {
    const { category, status, priority } = req.query;

    let filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const data = await Request.find(filter).sort({ createdAt: -1 });

    res.json(data);

  } catch (err) {
    console.error("Fetch requests error:", err);
    res.status(500).json("Error fetching requests");
  }
});

/* =========================================
   GET BY ID
========================================= */
router.get("/:id", requireAdmin, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json("Request not found");
    }

    res.json(request);

  } catch (err) {
    console.error("Fetch request error:", err);
    res.status(500).json("Error fetching request");
  }
});

/* =========================================
   UPDATE STATUS
========================================= */
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json("Status required");
    }

    const updated = await Request.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json("Request not found");
    }

    res.json(updated);

  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json("Error updating status");
  }
});

/* =========================================
   DELETE LOGIC WITH PASSWORD CONFIRMATION
========================================= */
const deleteResolvedRequest = async (req, res) => {
  try {
    const { password } = req.body;

    // 1. Check password provided
    if (!password) {
      return res.status(400).json("Password is required");
    }

    // 2. Find request
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json("Request not found");
    }

    // 3. Allow delete ONLY if resolved
    if (request.status !== "Resolved") {
      return res.status(400).json("Only resolved requests can be deleted");
    }

    // 4. Verify logged in user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json("User not found");
    }

    // 5. Verify password
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json("Invalid password");
    }

    // 6. Delete
    await request.deleteOne();

    res.json("Request deleted successfully");

  } catch (err) {
    console.error("Delete request error:", err);
    res.status(500).json("Error deleting request");
  }
};

/* =========================================
   DELETE ROUTES
========================================= */

// Main REST way
router.delete("/:id", requireAdmin, deleteResolvedRequest);

// Fallbacks for browsers/clients
router.post("/:id/delete", requireAdmin, deleteResolvedRequest);
router.post("/delete/:id", requireAdmin, deleteResolvedRequest);

export default router;
