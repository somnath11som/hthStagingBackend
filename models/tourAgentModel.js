const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcrypt");

const tourAgentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter agent name']
    },
    companyName: {
        type: String,
        required: [true, 'Please enter your company name']
    },
    companyLogo: {
        type: String,
        required: [true, 'Please enter your company logo']
    },
    address: {
        type: String,
        required: [true, 'please enter your address']
    },
});

const TourAgent = mongoose.model('TourAgent', tourAgentSchema);
module.exports = TourAgent;