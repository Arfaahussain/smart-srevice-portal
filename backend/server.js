import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/AuthRoutes.js";
import requestRoutes from "./routes/RequestRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());

// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);

app.get("/", (req, res) => {
  res.send("Smart Service Portal API Running");
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
