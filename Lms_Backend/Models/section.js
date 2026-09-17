const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
subsections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "subsection"     
      }]
});

module.exports = mongoose.model("section", sectionSchema);      