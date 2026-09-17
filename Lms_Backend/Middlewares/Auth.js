const jwt = require("jsonwebtoken");
const USER = require("../Models/user");
const dotenv = require("dotenv");
dotenv.config();


exports.auth = (req, res, next) => {
  try {
    // Authorization header se token nikalo
    const token = req.header("Authorization")?.replace("Bearer ", "");

    console.log("Received Token:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded User:", decoded);

    // User info request me attach karo
    req.user = decoded;

    next();
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token",
    });
  }
};




exports.isStudent = async (req, res, next) => {
    try {
        const user = await USER.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        if (user.accountType !== "Student") {
            return res.status(403).json({ message: "Access denied. Only students can access this resource." });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
};



exports.isInstructor = async (req, res, next) => {
    try {
        const userId = req.user.userId; // Assuming the user ID is stored in req.user after authentication
        const user = await USER.findById(userId);
        console.log(user)
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }   
    if (user.accountType !== "Instructor") {
            return res.status(403).json({ message: "Access denied. Only instructors can access this resource." });
        }       
        next();
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
};


exports.isAdmin = async (req, res, next) => {
    try {
        const user = await USER.findById(req.user._id); 
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        if (user.accountType !== "Admin") {
            return res.status(403).json({ message: "Access denied. Only admins can access this resource." });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
};
