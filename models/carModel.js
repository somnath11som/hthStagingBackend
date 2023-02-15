const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcrypt");
const Driver = require('./driverModel');
const CarOwner = require('./ownerModel');
const CarDocument = require('./carDocumentModel');

const CarSchema = new mongoose.Schema({
    carName: {
        type: String,
        required: [true, 'Please enter car name']
    },
    carModel: {
        type: String,
        required: [true, 'please enter choose car type'],
    },
    registration: [{
        registrationNo: {
            type: String,
            required: [true, 'Registration number is required'],
        },
        registrationExpire: {
            type: Date,
            required: [true, 'Registration expire date is required']
        },
        CarNumber: {
            type: String,
            required: [true, 'Please enter car number']
        }

    }],
    permit: [{ type: String, required: [true, 'Validity date is required'] }],

    availability: {
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        status: {
            type: String,
            default: '1'

        }
    },
    price: {
        type: Number,

    },
    created_at: {
        type: Date
    },
    driver: { type: mongoose.Schema.ObjectId, ref: 'Driver' },
    owner: { type: mongoose.Schema.ObjectId, ref: 'CarOwner' },
    document: { type: mongoose.Schema.ObjectId, ref: 'CarDocument' }
});

CarSchema.set('toObject', { virtuals: true });
CarSchema.set('toJSON', { virtuals: true });

const Car = mongoose.model('Car', CarSchema);
module.exports = Car;