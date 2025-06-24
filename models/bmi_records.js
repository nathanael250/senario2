const mongoose = require('mongoose');

const bmiRecordSchema = new mongoose.Schema({
    session_id: {
        type: String,
        required: true,
        index: true
    },
    phone_number: {
        type: String,
        required: true,
        index: true
    },
    weight: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    bmi_value: {
        type: Number,
        required: true
    },
    bmi_category: {
        type: String,
        required: true,
        enum: ['Underweight', 'Normal', 'Overweight', 'Obese', 'Ufite ibiro bikeya', 'Uri muzima', 'Ufite ibiro byinshi', 'Ufite ibiro byinshi cyane']
    },
    requested_tips: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: false }
});

module.exports = mongoose.model('BmiRecord', bmiRecordSchema);
