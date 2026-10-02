const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const wardrobeRoutes = require("./routes/wardrobeRoutes");
const outfitRoutes = require("./routes/outfitRoutes");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "https://wearwise-rose.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });

app.use("/api/wardrobe", wardrobeRoutes);
app.use("/api/outfits", outfitRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "WearWise API is running successfully",
  });
});

module.exports = app;