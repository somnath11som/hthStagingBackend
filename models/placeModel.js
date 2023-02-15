const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcrypt");
const Driver = require('./driverModel');
const Owner = require('./ownerModel');

const placePriceSchema = new mongoose.Schema({
    place: {
        type: String,
        required: [true, 'Please enter place name']
    },
    price: {
        type: Number,
        required: [true, 'Please add price per day']
    },
    carModel: {
        type: String,
        required: [true, 'Please enter car model']
    },
    perKmPrice: {
        type: Number,
        required: [true, 'Please enter per kilometer price']
    },
    createdAt: {
        type: Date
    },
    availability: {
        type: Number,
        default: 0
    }

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


const PlacePrice = mongoose.model('PlacePrice', placePriceSchema);
module.exports = PlacePrice;