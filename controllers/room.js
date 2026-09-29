const Hotel = require("../models/hotel");
const Room = require("../models/room");

const isHotelOwner = (hotel, user) => {
    return hotel.owner.toString() === user._id.toString()
}

exports.createRoom = async (req, res) => {
    try {
        const hotelId = req.params.hotelId;

        const { roomNumber, pricePerNight, type, capacity, image, amenities } =
            req.body;

        if (!roomNumber || !pricePerNight || !type || !capacity) {
            return res
                .status(400)
                .json({
                    message:
                        "Room number, Price per night, Type and Capacity are required!",
                });
        }

        const hotel = await Hotel.findById(hotelId);

        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found!" });
        }
        if(!isHotelOwner(hotel, req.user)) {
            return res.status(403).json({ message: "This is not your hotel!" });
        }
        const existRoom = await Room.findOne({ roomNumber, hotel: hotelId });

        if (existRoom) {
            return res
                .status(400)
                .json({ message: "Room already exist in this hotel" });
        }

        const room = new Room({
            roomNumber,
            pricePerNight,
            type,
            capacity,
            image,
            amenities,
            hotel: hotelId,
        });

        await room.save();

        res.status(201).json({ message: "Room added!", room });
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error!",
            error: err.message,
        });
    }
};
