const express = require('express');
const { userAuth, isOwner } = require('../middlewares/authentication');

const roomRouter = express.Router();

const roomController = require('../controllers/room');

roomRouter.post("/create/:hotelId", userAuth, isOwner, roomController.createRoom);

module.exports = roomRouter;