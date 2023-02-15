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

exports.allPlacePrice = async (req, res, next)=>{
    try{
        const price = await PlacePrice.find();
        if(price.length < 1) return response(200,1,'No data found', res);
        return response(200,1,{data:price}, res);
    }catch(err){
        console.log(err);
        return response(400,0,'Something error', res);
    }
    
}
