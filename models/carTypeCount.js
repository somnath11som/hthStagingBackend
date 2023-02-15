const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcrypt");
const Driver = require('./driverModel');
const CarOwner = require('./ownerModel');
const CarDocument = require('./carDocumentModel');

const CarTypeCountSchema = new mongoose.Schema({
    carModel: {
        type: String,
        required: [true, 'Please enter car model']
    },
    count: {
        type: Number,
        default: 0
    },


});

const CarTypeCount = mongoose.model('CarTypeCount', CarTypeCountSchema);
module.exports = CarTypeCount