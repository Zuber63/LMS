const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
        trim: true
    },
    courseDescription: {
        type: String,
        required: true,
        trim: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
       type: String,
       required: true,
       trim: true
        
    },
  whatYouWillLearn: [{
        type: String,
        required: true
    }],
   
    thumbnail: {
        type: String,
        required: true, 
    },
    language: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    benefits: [{
        type: String,
        required: true
    }],
    instructions: [{
        type: String,
        required: true
    }],
    ratings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "rating"
    }],
    courseContent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "section"
    }],
    studentsEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    status: {
        type: String,
        enum: ["Draft", "Published"],
        default: "Draft"
    }


});

module.exports = mongoose.model("course", courseSchema);
