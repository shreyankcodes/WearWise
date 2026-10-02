const mongoose = require("mongoose");

const wardrobeSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },

        name: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true,
            enum: ["Tops", "Bottoms", "Shoes", "Accessories"]
        },

        type: {
            type: String,
            required: true
        },

        color: {
            type: String,
            required: true
        },

        style: {
            type: String,
            required: true
        },

        image: {
            type: String,
            default: ""
        },

        favorite: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Wardrobe", wardrobeSchema);