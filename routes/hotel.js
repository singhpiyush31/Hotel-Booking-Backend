const express = require("express");
const { userAuth, isOwner, isAdmin } = require("../middlewares/authentication");
const hotelController = require("../controllers/hotel");

const hotelRouter = express.Router();

hotelRouter.post("/", userAuth, isOwner, hotelController.createHotel);
hotelRouter.get("/", hotelController.getHotel);
hotelRouter.get("/all", userAuth, isAdmin, hotelController.getAllHotels);
hotelRouter.get("/my", userAuth, isOwner, hotelController.getMyHotels);
hotelRouter.get("/:hotelId", hotelController.getHotelById);
hotelRouter.patch("/:hotelId", userAuth, isOwner, hotelController.updateHotel);

module.exports = hotelRouter;
