const express = require("express");
const routes = express.Router();

const { signup, login, sendOTP, changePassword, getUser ,resetPasswordToken, resetPassword} = require("../Controllers/auth");
const {auth}= require("../Middlewares/Auth");

routes.post("/signup", signup);
routes.post("/login", login);
routes.post("/sendotp", sendOTP);
routes.get("/getuser", auth, getUser);
routes.put("/changepassword", auth, changePassword);
routes.post("/reset-password-token", resetPasswordToken);
routes.post("/reset-password", resetPassword);
module.exports = routes;


