const mongoose = require('mongoose');

const ussdSessionSchema = new mongoose.Schema({
    session_id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    phone_number: {
        type: String,
        required: true,
        index: true
    },
    service_code: {
        type: String,
        default: null
    },
    current_step: {
        type: Number,
        default: 0
    },
    age: {
        type: Number,
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'terminated'],
        default: 'active',
        index: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('UssdSession', ussdSessionSchema);
