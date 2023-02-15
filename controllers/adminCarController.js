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
const axios = require('axios');

const response = (status, code, msg, res) => {
    return res.status(status).json({ status: code, message: msg });
}


exports.carDetails = async (req, res, next) => {
    try{
        const id = req.params.id;
       
        const carAllPaymentDetails = await DriverPayment.find({car:id}).populate('bookingId');
        if(carAllPaymentDetails.length < 1) return response(200,1, 'No record found', res);
        return response(200,1,{carAllPaymentDetails }, res);
    }catch(error){
        console.log(error);
        return response(400, 0, 'Something error', res);
    }
}

// exports.editCarDetails = async(req, res, next){

// }

exports.editCarDetails = async(req, res, next) => {
    try {
        const name = req.params.name;
        let status = 0;
        const getcardata = await Car.findOne({_id: req.params.id}).select('driver owner');
      
        const driverDataFatch = await Driver.findOne({_id:getcardata.driver}).select('userId');

        const loginDataFatch = await User.findOne({email: req.body.email});

        // if (loginDataFatch) return response(200, 0, 'Email already registered', res);

        if(!getcardata) return response(200,0,'Car details not found', res);

        if(name == 'driver'){
            
            const loginInfo = {
                name: req.body.driverName,
                role: 'driver',
                phone: req.body.driverMobile,
                email: req.body.email,
            };
            const driverData = {
                driverName: req.body.driverName,
                driverMobile: req.body.driverMobile,
                driverAddress: req.body.driverAddress,
                driverPhoto: req.body.driverPhoto,
            };
            const login = await User.findOneAndUpdate({_id:driverDataFatch.userId},{$set:loginInfo}, { runValidators: false });
            if(!login){
                status = 0;
            }else{
                const driverRegister = await Driver.updateOne({_id:getcardata.driver},{$set:driverData});
                if(!driverRegister){
                    status = 0;
                }else {
                    status = 1;
                }
            } 
        }else if(name == 'cngDriver'){
            let password = req.body.password.toString();
            let hashPassword = await bcrypt.hash(password, 12);
        const loginInfo = {
                name: req.body.driverName,
                role: 'driver',
                phone: req.body.driverMobile,
                email: req.body.email,
                password: hashPassword
            };
            const driverData = {
                driverName: req.body.driverName,
                driverMobile: req.body.driverMobile,
                driverAddress: req.body.driverAddress,
                driverPhoto: req.body.driverPhoto,
            };
            const login = await User.findOneAndUpdate({_id:driverDataFatch.userId},{$set:loginInfo}, { runValidators: false });
            if(!login){
                status = 0;
            }else{
                const driverRegister = await Driver.updateOne({_id:getcardata.driver},{$set:driverData});
                if(!driverRegister){
                    status = 0;
                }else {
                    status = 1;
                }
            } 
        }else if(name == 'pwCng'){
            
                const loginInfo = {};
                let password = req.body.password.toString();
                const passwordConfirm = req.body.passwordConfirm
                let hashPassword = await bcrypt.hash(password, 12);


                const login = await User.findOneAndUpdate({_id:driverDataFatch.userId},{$set:{password:hashPassword}}, { runValidators: false });
                if(login){
                    status = 1;
                }else{
                    status = 0;
                }
            
        }else if(name == 'owner'){
            const ownerData = {
                ownerName: req.body.ownerName,
                ownerMobile: req.body.ownerMobile,
                ownerAddress: req.body.ownerAddress,
            };
            const ownerRegister = await CarOwner.updateOne({_id:getcardata.owner}, {$set:ownerData});
            if(ownerRegister){
                status = 1;
            }else{
                status = 0;
            }

        }else if(name == 'car'){
            const carData = {
                carName: req.body.carName,
                carModel: req.body.carModel,
                registration: {
                    registrationNo: req.body.registrationNo,
                    registrationExpire: new Date(req.body.registrationExpire),
                    CarNumber: req.body.CarNumber

                },
                permit: req.body.permit,

                availability: {
                    startDate: new Date(req.body.startDate),
                    endDate: new Date(req.body.endDate),

                },
                price: req.body.price,

            };
            const carRegister = await Car.updateOne({_id:req.params.id},{$set:carData});
            if(carRegister){
                status = 1;
            }else{
                status = 0;
            }
        }else if(name == 'file'){
            const fileName = req.body.documentFile

                    const carDocuments = {
                        documentTypeName: req.body.documentNames,
                        documentFile: fileName,
                        car: req.params.id
                    };
                    const documentUpload = await carDocument.updateOne({car:req.params.id},{$set:carDocuments});
                    if(documentUpload){
                        status = 1;
                    }else{
                        status = 0;
                    }
        }
       console.log(status)
       if(status == 1){
        return response(201, 1, {msg: 'Data update successfully'}, res);

       }else{
        return response(201, 1, {msg: 'Something error'}, res);

       }
    } catch (err) {
        console.log(err)
        return response(404, 0, err.message, res)
    }
}



exports.getDistance = async(req, res, next) => {
    const origins = req.body.origins;
    const destinations = req.body.destinations;
    var config = {
        method: 'get',
        url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&units=imperial&key=${process.env.MAP_API_KEY}`,
        headers: { }
      };
      
      axios(config)
      .then(function (result) {
        const distance = result.data.rows[0].elements[0].distance.value / 1000;
        return response(200, 1, {distance, data:result.data }, res);
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
}