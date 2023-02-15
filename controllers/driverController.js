const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const Car = require("../models/carModel");
const AppError = require("../utils/appError");
const CarOwner = require("./../models/ownerModel");
const Driver = require("./../models/driverModel");
const DriverPayment = require("./../models/driverPayment");
const carDocument = require("./../models/carDocumentModel");
const PlacePrice = require("./../models/placeModel");
const CarTypeCount = require("./../models/carTypeCount");
const Booking = require("./../models/bookingModel");
const Includes = require("./../models/includeModel");
const sendEmail = require("../utils/mail");

const response = (status, code, msg, res) => {
  return res.status(status).json({ status: code, message: msg });
};

const formateDate = async (date) => {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

exports.getAllBooking = async (req, res, next) => {
  try {
    const driverId = await Driver.findOne({ userId: req.authUser.id });
    console.log(driverId);
    const bookingInfo = await DriverPayment.find({ driverId: driverId._id })
      .populate("car")
      .populate({
        path: "bookingId",
        select:
          "travelerInfo bookingDate pickupTime arrived pnrno carQuantity carModel totalDays travelStatus travelInfo payment price",
      });
    // const booking = await Booking.find({ driver: driverId._id }).sort({
    //   bookingDate: 1,
    // });
    // console.log(booking);


    response(200, 1, { booking: bookingInfo }, res);
  } catch (err) {
    console.log(err);
    response(400, 0, "Something error", res);
  }
};

exports.verifyBooking = async (req, res, next) => {
  // const verify = await Booking.find({ _id: req.body.id, travelStatus });
  // console.log(verify)
  try {
    if (req.body.id) {
      id = req.body.id;
      const verify = await Booking.find({ _id: req.body.id });
      console.log(verify);
      if (verify.length == 1) {
        const dbdate = await formateDate(verify[0].bookingDate);
        const newDate = await formateDate(new Date());
        console.log(newDate);
        console.log(dbdate);

        if (dbdate == newDate) {
          const update = await Booking.updateOne(
            { _id: req.body.id },
            { travelStatus: 1 }
          );
          response(200, 1, "Journey started", res);
        } else {
          console.log(verify[0].bookingDate.getMonth());
          console.log(new Date());
          response(200, 0, "Date is not matched", res);
        }
      } else {
        response(200, 0, "Booking not found or already started", res);
      }
    } else {
      console.log(err);
      response(200, 0, "Booking id is required", res);
    }
  } catch (err) {
    // console.log(err)
    response(400, 0, err, res);
  }
};

exports.completeJourney = async (req, res, next) => {
  try {
    const checkBooking = await Booking.findOne({ _id: req.body.id });
    if (!checkBooking) return response(400, 0, "Booking not found", res);
    if (checkBooking.travelStatus != 2) {
      if (checkBooking.dueAmount == 0) {
        const updateBooking = await Booking.updateOne(
          { _id: req.body.id },
          { travelStatus: 2 }
        );
        if (updateBooking.nModified == 1) {
          return response(200, 1, "Thank you! Journey completed", res);
        } else {
          return response(200, 0, updateBooking.nModified, res);
        }
      } else {
        if (req.body.dueAmount) {
          if (checkBooking.dueAmount == req.body.dueAmount) {
            let query = { _id: req.body.id };
            let updateData = {
              $set: { travelStatus: 2 },
              $push: {
                payment: {
                  amount: req.body.dueAmount,
                  driverName: req.authUser.name,
                  date: new Date(),
                },
              },
            };
            options = { upsert: true };

            const update = await Booking.updateOne(query, updateData);
            if (update) {
              console.log(update.nModified);
              return response(200, 1, "Thank you! Journey completed", res);
            } else {
              return response(200, 0, "Something error", res);
            }
          } else {
            return response(200, 0, "Amount does not match", res);
          }
        } else {
          return response(200, 0, "Please enter due amount", res);
        }
      }
      console.log(checkPayment.dueAmount);
    } else {
      return response(
        200,
        0,
        "Something error! Booking not found or already completed",
        res
      );
    }
  } catch (err) {
    console.log(err);
    return response(400, 0, "Something error", res);
  }
};

exports.update = async (req, res, next) => {
  return;
};

exports.sendMail = async (req, res, next) => {
  let options = {
    email: "somnathpoddar615@gmail.com",
    subject: "Testing",
    message: "Hello world",
  };
  const sendmail = await sendEmail(options);
  return res.status(200).json(sendmail);
};

exports.getCurrentLocation = async (req, res, next) => {
  try {
    const currentLocation = await Driver.findOne({ userId: req.authUser.id });
    if (!currentLocation) return response(400, 0, "Something error", res);
    if (currentLocation.length < 1)
      return response(400, 0, "no Record found", res);
    return response(200, 1, currentLocation, res);
  } catch (error) {
    console.log(error);
    return response(400, 0, "Something error", res);
  }
};

exports.updateLocation = async (req, res, next) => {
  try {
    if (!req.body.address)
      return response(400, 0, "Address or Driver id is required", res);
    const update = await Driver.updateOne(
      { userId: req.authUser.id },
      {
        currentLocation: {
          date: new Date(),
          location: req.body.address,
        },
      }
    );
    if (!update)
      return response(400, 0, "Something error! Location not updated", res);
    return response(201, 1, "Location updated", res);
  } catch (error) {
    console.log(error);
    return response(400, 0, error, res);
  }
};

const getCurrentLocation = async (req, res, next) => {
  try {
    const currentLocation = await Driver.findOne({
      userId: req.authUser.id,
    }).select("currentLocation");
  } catch (error) {
    console.log(error);
    return response(400, 0, error, res);
  }
};

exports.driverPayment1 = async (req, res, next) => {
  const payment = await DriverPayment.find({ driverId: req.authUser._id })
    .sort({ date: "asc" })
    .populate("bookingId")
    .populate("car");
  if (!payment) return response(400, 0, "Something error", res);
  return response(200, 1, payment, res);
};

exports.driverPayment = async (req, res, next) => {
  try {
    const driverDetails = await Driver.findOne({ userId: req.params.id });
    if (!driverDetails) return response(200, 0, "No driver found", res);
    const payment = await DriverPayment.find({
      driverId: driverDetails._id,
    }).populate({ path: "bookingId", select: "travelerInfo pnrno travelStatus" }).sort({date:-1});
    if (!payment) return response(200, 0, "No data found", res);
    return response(200, 1, payment, res);
  } catch (err) {
    console.log(err);
    return response(400, 0, "Something error", res);
  }
};

// exports.driverPayment = async (req, res, next)=> {
//     try{
//         const id = req.authUser._id
//         console.log(req.authUser);
//         const driverDetails = await Driver.find({userId: id}).select('_id');
//         console.log(driverDetails)
//         const allPayments = await DriverPayment.find({driverId:driverDetails._id}).sort({date:'asc'}).populate('bookingId').populate('car');
//         if(!allPayments) return response(200, 0, 'Something error', res)
//         if(allPayments.length < 1) return response(200, 0, 'No payment found', res)
//         return response(200, 1, {allPayments}, res)
//     }catch (err) {
//         // console.log(err)
//         response(400, 0, err, res);

//     }

// }
