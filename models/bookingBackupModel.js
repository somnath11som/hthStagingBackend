const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const Driver = require("./driverModel");
const CarOwner = require("./ownerModel");
const CarDocument = require("./carDocumentModel");
const User = require("./userModel");
const Car = require("./carModel");
const Booking = require("./bookingModel");
const BookingBackupSchema = new mongoose.Schema({
        pnrno:{
            type: String,
            required:[true, 'Please add pnr no.']
        },
        carModel: {
            type: String,
            required: [true, "please enter choose car type"],
        },
        carPref:{
            type:String
        },
        carQuantity: {
            type: Number,
            required: [true, "Please enter car quantity"],
        },
        travelerInfo: {
            travelerName: {
                type: String,
                required: [true, "please enter traveler name"],
            },
            travelerMobile: {
                type: String,
                required: [true, "please enter traveler mobile number"],
            },
            travelerAltMobile: {
                type: String,
            },
            travelerEmail: {
                type: String,
            },
            pickupLocation: {
                type: String,
                required: [true, "Please enter pickup location"],
            },

        },

        travelInfo: [{
            days: {
                type: Number,
            },
            start: {
                type: String,
            },
            via:{
                type:String
            },
            end: {
                type: String,
            },
            state: {
                type: String,
            },
        }, ],
        price: {
            type: Number,
            required: [true, "Please enter price for 1 km"],
        },
        car: { type: mongoose.Schema.ObjectId, ref: "Car" },
        travelStatus: {
            type: Number,
            default: 0,
        },
        created_at: {
            type: Date,
        },
        totalDays: {
            type: Number,
            required: [true, "Please enter total no. of days"],
        },
        bookingDate: {
            type: Date,
            required: [true, "Please enter booking date"],
        },
        pickupTime: {
            type: String,
            required: [true, "Please enter pickup time"],
        },
        markup: {
            type: Number,
            required: [true, 'Please enter markup']
        },
        arrived: {
            arrivedStatus: { type: Number, default: 0, },
            arrivedTime: { type: String }
        },
        updatedAt:{
            type: Date,
        },
        createdBy:{
            type:String
        },
       
        car:{type: mongoose.Schema.ObjectId, ref: 'Car'},
        driver: { type: mongoose.Schema.ObjectId, ref: 'Driver' },
        userId: { type: mongoose.Schema.ObjectId, ref: "User" },
        bookingId:{ type: mongoose.Schema.ObjectId, ref: "Booking"}
    }, {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },

);

BookingBackupSchema.set('toObject', { virtuals: true });
BookingBackupSchema.set('toJSON', { virtuals: true });


const BookingBackup = mongoose.model("BookingBackup", BookingBackupSchema);
module.exports = BookingBackup;