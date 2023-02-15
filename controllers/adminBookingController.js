const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const bcrypt = require("bcrypt");
const Car = require('../models/carModel');
const AppError = require('../utils/appError');
const CarOwner = require('./../models/ownerModel');
const Driver = require('./../models/driverModel');
const carDocument = require('./../models/carDocumentModel');
const PlacePrice = require('./../models/placeModel');
const CarTypeCount = require('./../models/carTypeCount');
const Booking = require('./../models/bookingModel');
const Includes = require('./../models/includeModel');
const DriverPayment = require("../models/driverPayment");
const TourAgent = require('../models/tourAgentModel');
const sendEmail = require('../utils/mail');


const response = (status, code, msg, res) => {
    return res.status(status).json({ status: code, message: msg });
}

const between = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

exports.booking = async(req, res, next) => {
    try {
        // console.log(new Date().getTime());
        // return;
        if (
            req.body.carModel &&
            req.body.travelInfo &&
            req.body.pickupTime &&
            req.body.totalDays &&
            req.body.bookingDate &&
            req.body.travelerInfo
        ) {
            let days = 0;

            const totalDays = req.body.totalDays;
            const travelInfo = req.body.travelInfo;
            const price = req.body.price;
            const carModel = req.body.carModel;
            const carPref = req.body.carPref;
            const bookingDate = req.body.bookingDate;
            const pickupTime = req.body.pickupTime;
            const travelerInfo = req.body.travelerInfo;
            const carQuantity = req.body.carQuantity;
            const markup = req.body.markup;
            const AdvanceAmount = req.body.AdvanceAmount
            const payment = [
                {
                    "amount": AdvanceAmount,
                    "paymentId": new Date().getTime(),
                    "orderId": new Date().getTime(),
                    "signature":"Admin Booking",
                    "date": new Date()
                }
                
            ]


            //   const travelerAltMobile = req.body.travelerAltMobile;
            //   const travelerMobile = req.body.travelerMobile;
            //   const travelerEmail = req.body.travelerEmail;
            const createdAt = new Date();
            console.log(createdAt);
            const currentDate = new Date().toJSON().slice(0,10);
            let date = '';
            let dbDate = date.concat('PNR-',currentDate.slice(8, 10), currentDate.slice(5, 7), currentDate.slice(2, 4), getRandomInt(9999));
            let checkpnr = 1;
            while(checkpnr == 1){
                const pnrCheck = await Booking.findOne({pnrno:dbDate});
                if(!pnrCheck){
                    checkpnr = 0;
                }
            }
            console.log(dbDate);
            const data = {
                pnrno:dbDate,
                totalDays: totalDays,
                travelInfo: travelInfo,
                price: price,
                carModel: carModel,
                carPref:carPref,
                payment: payment,
                bookingDate: bookingDate,
                createdAt: createdAt,
                pickupTime: pickupTime,
                pickupLocation: req.body.pickupLocation,
                travelerInfo: travelerInfo,
                carQuantity: carQuantity,
                markup: markup,
                // travelerAltMobile: travelerAltMobile,
                // travelerMobile: travelerMobile,
                // travelerEmail: travelerEmail,
                userId: req.authUser.id,
                bookingId: new Date().getTime(),
            };


            travelInfo.forEach(async(el) => {
                days = days + parseInt(el.days);
                console.log(travelInfo);
            });

            console.log({days, totalDays});
            if (days == totalDays) {
                const bookingInsert = await Booking.create(data);
                if (bookingInsert) {
                    let options = {
                        email: req.authUser.email,
                        subject: 'Booking Confirmation',
                        message: bookingInsert.pnrno
                    };
                    response(201, 1, bookingInsert, res);
                    const sendmail = await sendEmail(options);
                    return;

                } else {
                    return response(404, 0, "Something error! Please try again", res);
                }
            } else {
                return response(404, 0, "Total days does not matched", res);
            }
        } else {
            return response(404, 0, "Please fill all fields", res);
        }
    } catch (err) {
        console.log(err);
        return response(404, 0, err.message, res);
    }
};


exports.getAllBooking = async(req, res, next) => {
    try {
        
        const booking = await Booking.find().sort({ _id: -1 }).populate('driver').populate('userId').populate('car'); 
        if (booking) {
            return response(200, 1, booking, res);
        } else {
            return response(400, 0, 'Booking not found', res);
        }
    } catch (err) {
        console.log(err);
        return response(404, 0, err.message, res);
    }
}



exports.editBooking = async(req, res, next)=>{
    try {
        // console.log(new Date().getTime());
        // return;
        // console.log({carModel:req.body.carModel,
        //     travelInfo:req.body.travelInfo,
        //    price: req.body.price,
        //     payment:req.body.payment,
        //    pickUp: req.body.pickupTime,
        //     totalDays: req.body.totalDays,
        //    bookingDate: req.body.bookingDate,
        //    travelerInfo: req.body.travelerInfo,
        //    markup:req.body.markup});
        //    return;
        if (
            req.body.carModel &&
            req.body.travelInfo &&
            req.body.price &&
            req.body.payment &&
            req.body.pickupTime &&
            req.body.totalDays &&
            req.body.bookingDate &&
            req.body.travelerInfo &&
            req.body.markup
        ) 
        
      
        {
            
            let days = 0;

            const totalDays = req.body.totalDays;
            const travelInfo = req.body.travelInfo;
            const price = req.body.price;
            const carModel = req.body.carModel;
            const payment = req.body.payment;
            const bookingDate = req.body.bookingDate;
            const pickupTime = req.body.pickupTime;
            const travelerInfo = req.body.travelerInfo;
            const carQuantity = req.body.carQuantity;
            const markup = req.body.markup;
            //   const travelerAltMobile = req.body.travelerAltMobile;
            //   const travelerMobile = req.body.travelerMobile;
            //   const travelerEmail = req.body.travelerEmail;
            const createdAt = new Date();
            console.log(createdAt);
            const currentDate = new Date().toJSON().slice(0,10);
            let date = '';
            let dbDate = date.concat('PNR-',currentDate.slice(8, 10), currentDate.slice(5, 7), currentDate.slice(2, 4), getRandomInt(9999));
            let checkpnr = 1;
            while(checkpnr == 1){
                const pnrCheck = await Booking.findOne({pnrno:dbDate});
                if(!pnrCheck){
                    checkpnr = 0;
                }
            }
            console.log(dbDate);
            const data = {
                pnrno:dbDate,
                totalDays: totalDays,
                travelInfo: travelInfo,
                price: price,
                carModel: carModel,
                payment: payment,
                bookingDate: bookingDate,
                createdAt: createdAt,
                pickupTime: pickupTime,
                pickupLocation: req.body.pickupLocation,
                travelerInfo: travelerInfo,
                carQuantity: carQuantity,
                markup: markup,
                // travelerAltMobile: travelerAltMobile,
                // travelerMobile: travelerMobile,
                // travelerEmail: travelerEmail,
                userId: req.authUser.id,
                bookingId: new Date().getTime(),
            };


            travelInfo.forEach(async(el) => {
                days = days + el.days;
                console.log(travelInfo);
            });


            if (days == totalDays) {
                const bookingInsert = await Booking.updateOne({pnrno:req.params.id}, data);
                if (bookingInsert) {
                    let options = {
                        email: req.authUser.email,
                        subject: 'Booking Confirmation',
                        message: bookingInsert.pnrno
                    };
                    return response(201, 1, `pnrno: ${req.params.id}, Udate successfully`, res);

                } else {
                    return response(404, 0, "Something error! Please try again", res);
                }
            } else {
                return response(404, 0, "Total days does not matched", res);
            }
        } else {
            return response(404, 0, "Please fill all fields", res);
        }
    } catch (err) {
        console.log(err);
        return response(404, 0, err.message, res);
    }
}