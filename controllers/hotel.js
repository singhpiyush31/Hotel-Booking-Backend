const User = require("../models/user");
const Hotel = require("../models/hotel");
const { sendEmail } = require("../utils/sendEmail");
const { searchRegex } = require("../utils/filter");
const { pagination } = require("../utils/pagination");

exports.createHotel = async (req, res) => {
    try {
        const { name, description, address, images, city, amenities } =
            req.body;

        if (!name || !address || !city) {
            return res
                .status(400)
                .json({ message: "All name, city and address are required!" });
        }

        const hotel = new Hotel({
            name,
            description,
            address,
            images,
            city,
            amenities,
            owner: req.user._id,
        });
        await hotel.save();

        const admins = await User.find({ role: "Admin" });

        for (let i = 0; i < admins.length; i++) {
            const admin = admins[i];
            await sendEmail({
                to: admin.email,
                subject: `[Action Required] New hotel listing pending approval: ${hotel.name} (${hotel.city})`,
                text: `Hello ${admin.name},

A new hotel has been registered and is waiting for your review.

Hotel Details:
- Name: ${hotel.name}
- City: ${hotel.city}
- Address: ${hotel.address}
- Description: ${hotel.description || "Not provided"}
- Amenities: ${hotel.amenities.length ? hotel.amenities.join(", ") : "None listed"}
- Hotel ID: ${hotel._id}

Submitted By:
- Name: ${req.user.name}
- Email: ${req.user.email}

Please log in to the admin panel to approve or reject this listing. The hotel will not be visible to customers until it is approved.

Thank you,
Hotel Booking Team`,
            });
        }
        res.status(201).json({
            message: "Hotel registered, waiting for the admin approval.",
            hotel,
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error!",
            error: err.message,
        });
    }
};

exports.getHotel = async (req, res) => {
    try {
        const { page, limit, skip } = pagination(req.query);

        const filter = { isActive: true, status: "Approved" };

        if (req.query.search) {
            filter.name = searchRegex(req.query.search);
        }
        if (req.query.city) {
            filter.city = searchRegex(req.query.city);
        }
        if (req.query.amenities) {
            filter.amenities = { $all: req.query.amenities.split(",") };
        }

        const totalHotels = await Hotel.countDocuments(filter);

        const totalPages = Math.ceil(totalHotels / limit);

        const hotel = await Hotel.find(filter)
            .select("-owner -status -isActive")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            message: "Hotels: ",
            hotel,
            page,
            limit,
            pages: totalPages,
            total: totalHotels,
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error!",
            error: err.message,
        });
    }
};
