const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['income', 'expense']
    },
    budgetLimit: {
        type: Number,
        default: null
    },
    color: {
        type: String,
        default: '#4CAF50'
    },
    icon: {
        type: String,
        default: 'Shopping'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
categorySchema.index({ userId: 1, type: 1 });

module.exports = mongoose.model('Category', categorySchema); 