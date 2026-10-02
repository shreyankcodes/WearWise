const mongoose = require("mongoose");

const outfitSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    occasion: {
      type: String,
      required: true,
    },

    items: {
      Tops: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },

      Bottoms: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },

      Shoes: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },

      Accessories: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Outfit", outfitSchema);