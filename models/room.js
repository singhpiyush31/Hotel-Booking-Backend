const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        roomNumber: {
            type: String,
            required: true,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        pricePerNight: {
            type: Number,
            required: true,
            min: 0,
        },
        image: {
            type: [String],
            default: [],
        },
        type: {
            type: String,
            enum: ["Single", "Double", "Deluxe", "Suite"],
            required: true,
            trim: true,
        },
        amenities: {
            type: [String],
            default: [],
        },
        capacity: {
            type: Number,
            required: true,
            min: 1,
        },
        hotel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel",
            required: true,
        },
    },
    { timestamps: true },
);

roomSchema.index({ hotel: 1, roomNumber: 1 }, { unique: true });

module.exports = mongoose.model("Room", roomSchema);
