const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true, 
        trim: true
    },
    lastName: {
        type: String,
        required: true, 
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: Number,
        required: true,
        trim: true
    },
    accountType: {
        type: String,
        enum: ['Student', 'Instructor', 'Admin'],
        required: true
    },
    additionalInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profile',
    },
    course: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course',
    }],
    courseProgress: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'courseProgress',
    }], 
    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
    }],

    token: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    
}, { timestamps: true }); // Optional: createdAt aur updatedAt tracks karne ke liye

module.exports = mongoose.model("user", userSchema);