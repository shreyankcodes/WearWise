const express = require("express");
const router = express.Router();

const Wardrobe = require("../models/Wardrobe");
const verifyToken = require("../middleware/authMiddleware");

// CREATE wardrobe item
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, category, type, color, style, image, favorite } = req.body;

    const wardrobeItem = new Wardrobe({
      userId: req.user.uid,
      name,
      category,
      type,
      color,
      style,
      image,
      favorite: favorite || false,
    });

    const savedItem = await wardrobeItem.save();

    res.status(201).json(savedItem);
  } catch (error) {
    console.error("Create wardrobe item error:", error);

    res.status(500).json({
      message: "Failed to create wardrobe item",
    });
  }
});

// GET user's wardrobe
router.get("/", verifyToken, async (req, res) => {
  try {
    const items = await Wardrobe.find({
      userId: req.user.uid,
    }).sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    console.error("Get wardrobe error:", error);

    res.status(500).json({
      message: "Failed to fetch wardrobe",
    });
  }
});

// UPDATE wardrobe item
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const item = await Wardrobe.findOne({
      _id: req.params.id,
      userId: req.user.uid,
    });

    if (!item) {
      return res.status(404).json({
        message: "Wardrobe item not found",
      });
    }

    const allowedFields = [
      "name",
      "category",
      "type",
      "color",
      "style",
      "image",
      "favorite",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        item[field] = req.body[field];
      }
    });

    const updatedItem = await item.save();

    res.json(updatedItem);
  } catch (error) {
    console.error("Update wardrobe error:", error);

    res.status(500).json({
      message: "Failed to update wardrobe item",
    });
  }
});

// DELETE wardrobe item
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedItem = await Wardrobe.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.uid,
    });

    if (!deletedItem) {
      return res.status(404).json({
        message: "Wardrobe item not found",
      });
    }

    res.json({
      message: "Wardrobe item deleted successfully",
    });
  } catch (error) {
    console.error("Delete wardrobe error:", error);

    res.status(500).json({
      message: "Failed to delete wardrobe item",
    });
  }
});

module.exports = router;