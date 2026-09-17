const express = require("express");
const {auth, isStudent, isInstructor, isAdmin} = require("../Middlewares/Auth");
const routes = express.Router();

const { updateProfile} = require("../Controllers/profile");

routes.put("/updateprofile",auth,updateProfile);

module.exports = routes;