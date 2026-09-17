const mongoose = require("mongoose");
const dotenv = require("dotenv").config();



exports.connectDB = async () => {
    try{
        await mongoose.connect(process.env.DATA_BASE_URL);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}