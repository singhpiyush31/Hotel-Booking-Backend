const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minLength: 5,
            maxLength: 50,
        },
        description: {
            type: String,
            minLength: 10,
            maxLength: 300,
            trim: true,
        },
        city: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        image: {
            type: [String],
            default: [],
        },
        amenities: {
            type: [String],
            default: [],
        },
        address: {
            type: String,
            required: true,
            trim: true,
            minLength: 20,
            maxLength: 200,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rejectionReason: {
            type: String,
            trim: true,
            minLength: 50,
            maxLength: 500,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Hotel", hotelSchema);