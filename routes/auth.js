const express = require('express');
const authController = require('../controllers/auth');
const { userAuth } = require('../middlewares/authentication');

const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);
authRouter.get("/my", userAuth, authController.my);

module.exports = authRouter;

