const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const wardrobeRoutes = require("./routes/wardrobeRoutes");
const outfitRoutes = require("./routes/outfitRoutes");

dotenv.config();

const app = express();

const corsOptions = {
  origin: "https://wearwise-rose.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Handle browser preflight requests
app.options(/.*/, cors(corsOptions));

app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });

// API routes
app.use("/api/wardrobe", wardrobeRoutes);
app.use("/api/outfits", outfitRoutes);

// API health check
app.get("/", (req, res) => {
  res.json({
    message: "WearWise API is running successfully",
  });
});

module.exports = app;