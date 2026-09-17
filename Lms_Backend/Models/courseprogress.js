const mongoose = require("mongoose");
const courseProgressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
        required: true
    },
  completedVideos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "subsection"
    }]
});

module.exports = mongoose.model("courseProgress", courseProgressSchema);