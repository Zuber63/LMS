const monngoose = require("mongoose");

const ratingSchema = new monngoose.Schema({
    userId: {
        type: monngoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    courseId: {
        type: monngoose.Schema.Types.ObjectId,
        ref: "course",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
    required: true
    }
});

module.exports = monngoose.model("rating", ratingSchema);
