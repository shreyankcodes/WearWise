const express = require("express");
const router = express.Router();

const Outfit = require("../models/Outfit");
const verifyToken = require("../middleware/authMiddleware");

// CREATE outfit
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, occasion, items } = req.body;

    const outfit = new Outfit({
      userId: req.user.uid,
      name,
      occasion,
      items,
    });

    const savedOutfit = await outfit.save();

    res.status(201).json(savedOutfit);
  } catch (error) {
    console.error("Create outfit error:", error);

    res.status(500).json({
      message: "Failed to create outfit",
    });
  }
});

// GET user's outfits
router.get("/", verifyToken, async (req, res) => {
  try {
    const outfits = await Outfit.find({
      userId: req.user.uid,
    }).sort({ createdAt: -1 });

    res.json(outfits);
  } catch (error) {
    console.error("Get outfits error:", error);

    res.status(500).json({
      message: "Failed to fetch outfits",
    });
  }
});

// GET single outfit
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const outfit = await Outfit.findOne({
      _id: req.params.id,
      userId: req.user.uid,
    });

    if (!outfit) {
      return res.status(404).json({
        message: "Outfit not found",
      });
    }

    res.json(outfit);
  } catch (error) {
    console.error("Get outfit error:", error);

    res.status(500).json({
      message: "Failed to fetch outfit",
    });
  }
});

// DELETE outfit
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedOutfit = await Outfit.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.uid,
    });

    if (!deletedOutfit) {
      return res.status(404).json({
        message: "Outfit not found",
      });
    }

    res.json({
      message: "Outfit deleted successfully",
    });
  } catch (error) {
    console.error("Delete outfit error:", error);

    res.status(500).json({
      message: "Failed to delete outfit",
    });
  }
});

module.exports = router;