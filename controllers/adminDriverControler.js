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
}

exports.DriverDetails = async (req, res, next)=> {
    try{
        const list = await DriverPayment.find({$and:[{bookingId:{$ne:null}}, {driverId:{$ne:null}}]}).populate('bookingId').populate('driverId');
        if(list.length < 1) return response(400, 0, 'No record found', res)
        response(200, 1, {status:1, driverDetails:list}, res);
    }catch(error){
        console.log(error);
        return response(400, 0, 'Something Error', res);
    }
}

exports.driverEdit = async (req, res, next) => {
    try{
        $id = req.params.id;
        // const update = await 
    }catch(err){
        console.log(err);
        return response(400, 0, 'Something error', res);
    }
}

exports.driverUpdate = async (req, res, next) => {
    try{
        const id = req.params.id;
        const bookingInfo = await Booking.findById(id);
        const bookingDriverUpdate = await Booking.updateOne({_id:id},{
            $set: {
                
            }
        }
            )
    }catch(error){
        console.log(error);
        return response(400,0,'Something error');
    }
}