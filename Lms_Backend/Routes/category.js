const expess = require("express");
const router = expess.Router();
const { createCategory } = require("../Controllers/category");
const { auth, isAdmin } = require("../Middlewares/Auth");

router.post("/createCategory", auth, isAdmin, createCategory);