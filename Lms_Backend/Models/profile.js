const moongose = require('mongoose');

const profileSchema = new moongose.Schema({ 
gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
},
dob: {
    type: Date,
},
profession: {
    type: String,
},
about: {
    type: String,
},


});

module.exports = moongose.model('profile', profileSchema);