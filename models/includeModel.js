const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcrypt");
const Driver = require('./driverModel');
const CarOwner = require('./ownerModel');
const CarDocument = require('./carDocumentModel');
const User = require('./userModel');

const IncludesSchema = new mongoose.Schema({
    carModel: {
        type: String,
        required: [true, 'please enter choose car type'],
    },
    includes: {
        type: String,
        required: [true, 'Please enter includes']
    },

    excludes: {
        type: String,
        required: [true, 'Please enter excludes']
    },
    passenger: {
        type: String,
        required: [true, 'Please enter Passenger capacity']
    },
    luggage: {
        type: String,
        required: [true, 'Please enter Luggage capacity']
    },
    created_at: {
        type: Date
    },
    image: {
        type: String
    }
});

IncludesSchema.set('toObject', { virtuals: true });
IncludesSchema.set('toJSON', { virtuals: true });

const Includes = mongoose.model('Includes', IncludesSchema);
module.exports = Includes;