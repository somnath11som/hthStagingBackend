const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const Driver = require("./driverModel");
const CarOwner = require("./ownerModel");
const CarDocument = require("./carDocumentModel");
const User = require("./userModel");
const Car = require("./carModel");

const BookingSchema = new mongoose.Schema({
        pnrno:{
            type: String,
            required:[true, 'Please add pnr no.']
        },
        bookingId: {
            type: String,
            required: [true, 'Please enter booking id']
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
        payment: [{
            amount: {
                type: Number,
                required: [true, "Please enter amount"],
            },
            paymentId: {
                type: String,
                required: [true, "Please enter payment Id"],
            },
            orderId: {
                type: String,
                required: [true, "Please enter order Id"],
            },
            signature: {
                type: String,
                required: [true, "Please enter signature Id"],
            },
            driverName: {
                type: String
            },
            date: {
                type: Date,
                required: [true, "Please enter date"],
            },
        }, ],
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
        modifiedBy:{ type: mongoose.Schema.ObjectId, ref: "User" },
        car:{type: mongoose.Schema.ObjectId, ref: 'Car'},
        driver: { type: mongoose.Schema.ObjectId, ref: 'Driver' },
        userId: { type: mongoose.Schema.ObjectId, ref: "User" },
    }, {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },

);

BookingSchema.set('toObject', { virtuals: true });
BookingSchema.set('toJSON', { virtuals: true });

BookingSchema.virtual("dueAmount").get(function() {
    const pay = this.payment;
    
    let payment = 0;
    if(pay){
    for (i = 0; i < pay.length; i++) {
        payment = pay[i].amount + payment;
    }
}
    return (due = this.price - payment);
});

const Booking = mongoose.model("Booking", BookingSchema);
module.exports = Booking;