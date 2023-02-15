const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcrypt");
const Driver = require('./driverModel');
const Owner = require('./ownerModel');

const DriverDocumentSchema = new mongoose.Schema({
    documentName: [{ type: String, required: [true, 'please specify documents name'] }],
    documentFile: {
        required: [true, 'Please upload the file'],
        type: String
    },
    driver: { type: mongoose.Schema.ObjectId, ref: 'Driver' },
});

CarSchema.set('toObject', { virtuals: true });
CarSchema.set('toJSON', { virtuals: true });

const DriverDocument = mongoose.model('DriverDocument', DriverDocumentSchema);
module.exports = DriverDocument;