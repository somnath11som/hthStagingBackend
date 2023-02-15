const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcrypt");
const Driver = require('./driverModel');
const CarOwner = require('./ownerModel');
const CarDocument = require('./carDocumentModel');
const User = require('./userModel');

const GetQuoteSchema = new mongoose.Schema({
    carModel: {
        type: String,
        required: [true, 'please enter choose car type'],
    },
    travelInfo: [{
        days: {
            type: Number
        },
        start: {
            type: String
        },
        end: {
            type: String
        },
        state: {
            type: String
        }
    }],
    price: {
        type: Number,
        required: [true, 'Please enter price for 1 km']
    },
    created_at: {
        type: Date
    },
    totalDays: {
        type: Number,
        required: [true, 'Please enter total no. of days']
    },
    userId: { type: mongoose.Schema.ObjectId, ref: 'User' },
});

GetQuoteSchema.set('toObject', { virtuals: true });
GetQuoteSchema.set('toJSON', { virtuals: true });

const GetQuote = mongoose.model('GetQuote', GetQuoteSchema);
module.exports = GetQuote;