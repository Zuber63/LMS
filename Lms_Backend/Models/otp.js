const mongoose = require("mongoose");
const {mailSender} = require("../Utils/mail")
const otpSchema = new mongoose.Schema({
    email: {
        type: String,   
        required: true,
        trim: true
    },
    otp: {
        type: String,
        required: true
    },
cratedAt: {
        type: Date,
        default: Date.now,
        expires: 300 // OTP will expire after 5 minutes (300 seconds)
    }
});





module.exports = mongoose.model("otp", otpSchema);