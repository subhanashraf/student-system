const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    id: { 
        type: Number,
        unique: true,
        required: false
    }, 
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: false
    },
    status: [{
        type: String,
        required: false
    }],
    Application: [{
        type: String,
        required: false
    }],
    date: [{
        type: Date,
        default: Date.now
    }]
});

module.exports = mongoose.model('Student', studentSchema);
