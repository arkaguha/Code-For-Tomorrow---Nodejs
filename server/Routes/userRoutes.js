const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");

module.exports = router
  .get("/", userController.apiTest)
  .post("/login", userController.postLogin)
  .post("/signup", userController.postSignup)
  .get("/user/info/:id", userController.getUserInfo)
  .post("user/password/forget", userController.postForgetPassword)
  .post("user/password/:resetToken", userController.postPasswordReset);
