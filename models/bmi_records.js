const mongoose = require('mongoose');

const bmiRecordSchema = new mongoose.Schema({
    session_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UssdSession',
        required: true,
        index: true
    },
    phone_number: {
        type: String,
        required: true,
        index: true
    },
    age: {
        type: Number,
        required: true
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

bmiRecordSchema.methods.getSessionData = function() {
    return this.populate('session_id');
};

module.exports = mongoose.model('BmiRecord', bmiRecordSchema);
