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

const DriverPaymentSchema = new mongoose.Schema({
    totalPrice:{
        type:String,   
    },
    date:{
        type:String,
       
    },
    driverId: { type: mongoose.Schema.ObjectId, ref: "Driver" },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    pnrno:{
        type:String
    },
    car:{type:mongoose.Schema.Types.ObjectId, ref:"Car"},
    payment: [
        {
        amount: {
            type: Number,
            required: [true, "Please enter amount"],
        },
        date: {
            type: Date,
            required: [true, "Please enter date"],
        },
        paymentMood: {
            type: String,
            required: [true, "Please choose payment mood"]
        },
        tnId:{
            type:String
        }
    }, 
],
}, 
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
},

);

DriverPaymentSchema.set('toObject', { virtuals: true });
DriverPaymentSchema.set('toJSON', { virtuals: true });

DriverPaymentSchema.virtual("dueAmount").get(function() {
    const pay = this.payment;
    let payment = 0;
    for (i = 0; i < pay.length; i++) {
        payment = pay[i].amount + payment;
    }
    return (due = this.totalPrice - payment);
});

const DriverPayment = mongoose.model("DriverPayment", DriverPaymentSchema);
module.exports = DriverPayment;