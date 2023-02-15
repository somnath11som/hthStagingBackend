const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcrypt");
const User = './userModel';

const DriverSchema = new mongoose.Schema({
    driverName: {
        type: String,
        required: [true, 'Please enter driver name'],
    },
    driverMobile: {
        type: Number,
        required: [true, 'Please enter driver mobile number']
    },
    driverAddress: {
        type: String,
        required: [true, "Please enter driver's address"]
    },
    driverPhoto: {
        type: String,
        required: [true, 'Please choose a photo']
    },
    driverStatus: {
        type: String,
        enum: ['0', '1'],
        default: '1'
    },
    currentLocation: {
        date: { type: String },
        location: { type: String }
    },
    userId: { type: mongoose.Schema.ObjectId, ref: "User" }
});

const Driver = mongoose.model('Driver', DriverSchema);
module.exports = Driver;