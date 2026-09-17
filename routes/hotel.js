const express = require('express');
const { userAuth, isOwner } = require('../middlewares/authentication');
const hotelController = require('../controllers/hotel');

const hotelRouter = express.Router();

hotelRouter.post("/", userAuth, isOwner, hotelController.createHotel);

module.exports = hotelRouter;