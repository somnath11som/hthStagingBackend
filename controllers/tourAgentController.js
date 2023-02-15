const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const crypto = require("crypto");
const { Promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const bcrypt = require("bcrypt");
const Car = require("../models/carModel");
const CarOwner = require("./../models/ownerModel");
const Driver = require("./../models/driverModel");
const PlacePrice = require("./../models/placeModel");
const CarTypeCount = require("./../models/carTypeCount");
const GetQuote = require("./../models/getQuoteModel");
const Booking = require("./../models/bookingModel");
const Razorpay = require("razorpay");
const Includes = require("../models/includeModel");
const Register = require("../models/registerModel");
const Request = require("request");
const QRCode = require('qrcode');
const sendEmail = require('../utils/mail');

const QrCodeGenarate = async(stringdata) => {
    const QrcodeG = QRCode.toString(stringdata, { type: 'terminal' },
        function(err, QRcode) {
            if (err) return console.log("error occurred")
            console.log(QRcode)
        });
    return Qrcode;
}

const response = (status, code, msg, res) => {
    return res.status(status).json({ status: code, message: msg });
};

const between = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const helloFunction = async(req, res, carInfo) => {
    let totalDistance = 0;

    const info = req.body.travelInfo;
    for (let a = 0; a < info.length; a++) {
        totalDistance = parseInt(info[a].distance) + totalDistance;
    }
    minDistance = req.body.totalDays * 250;

    let price = {};
    let totalPrice = [];
    let extraPrice = 0;
    for (let i = 0; i < carInfo.length; i++) {
        let mCarInfo = carInfo[i];
        if (totalDistance > minDistance) {
            extraPrice = (totalDistance - minDistance) * mCarInfo[0].perKmPrice;
            console.log(totalDistance - minDistance);
        }
        price.carModel = mCarInfo[0].carModel;
        price.availability =parseInt( Math.random() * 10);
        let carPrice = 0;
        for (let m = 0; m < mCarInfo.length; m++) {
            carPrice = mCarInfo[m].price + carPrice;
        }
        price.totalPrice = parseInt(carPrice) + parseInt(extraPrice);
        price.carExInfo = await Includes.find({
            carModel: mCarInfo[0].carModel,
        }).select("includes excludes passenger luggage ");
        if (i == carInfo.length - 1) {
            totalPrice.push(price);
            return response(200, 1, totalPrice, res);
        }
        totalPrice.push(price);
        price = {};
    }
};

exports.getAllCar = async(req, res, next) => {
    try {
        if (req.body.date) {
            const date = new Date(req.body.date);
            const cars = await Car.find({
                $and: [
                    { "availability.startDate": { $gte: date } },
                    { "availability.startDate": { $lte: date } },
                ],
            });
            console.log(new Date(req.body.date));
            if (cars.length > 0) {
                return response(200, 1, cars, res);
            } else {
                return response(200, 1, "No car found", res);
            }
        }
    } catch (err) {
        console.log(err);
        return response(404, 0, err.message, res);
    }
};

exports.getCar = async(req, res, next) => {
    try {
        const id = req.params.id;
        const cars = await Car.find({ _id: id })
            .populate("driver", "driverName")
            .select("carName carModel");
        if (cars.length > 0) {
            return response(200, 1, cars, res);
        } else {
            return response(200, 1, "No car found", res);
        }
    } catch (err) {
        console.log(err);
        return response(404, 0, err.message, res);
    }
};

const allCarPrice = async(place, cars) => {
    let findPlace = [];
    place.forEach(async(el) => {
        const sPlace = { place: el.place };
        findPlace.push(sPlace);
    });
    const carPrice = await PlacePrice.find({ $or: findPlace, place: place });
    return carPrice;
};

const new1 = async(places) => {
    let carPrices = [];
    places.forEach(async(el) => {
        const cars = await allCarPrice(el.place);
        if (cars) {
            carPrices.push(cars);
            return carPrices;
            console.log(carPrices);
        }
    });
};

const getPlace = async(places) => {
    let data = [];
};

// "travelInfo" : [
//     {
//     "day":1,
//     "start": "malda",
//     "end": "kolkata",
//     "Sstate": "Meghalaya",
//     "Estate": "Meghalaya",
//     "distance": "301"
//     },
//     {
//     "day":2,
//     "start": "malda",
//     "end": "kolkata",
//     "Sstate": "Meghalaya",
//     "Estate": "Meghalaya",
//     "distance": "301"
//     }

// ]

// exports.multiDaysPrice = async(req, res, next) => {
//     try {
//         if (req.body.totalDays || req.body.travelInfo) {
//             const travelInfo = req.body.travelInfo;
//             let carModel = ["SUV", "SEDAN", "TRAVELER"];

//             let allCarPrice = [];
//             const totalSuvPrice = [];
//             const totalSedanPrice = [];
//             const InovaPrice = [];

//             const allPlacePrice = {};
//             for (i = 0; i < travelInfo.length; i++) {
//                 let place = travelInfo[i];
//                 for (k = 0; k < carModel.length; k++) {
//                     let allCar = [];
//                     let cars = 0;

//                     carModel[k] = await PlacePrice.find({ place: place.Sstate });
//                     if (carModel[k].length > 0) {
//                         allCar.push(carModel[k]);
//                         console.log(carModel[k]);
//                     } else {
//                         allCar = [];
//                         k = carModel.length;
//                         console.log(k);
//                     }

//                     if (k == carModel.length - 1) {
//                         if (i == travelInfo.length - 1) {
//                             allCarPrice.push(allCar);
//                             // return response(404, 0, allCarPrice, res);
//                         } else {
//                             allCarPrice.push(allCar);
//                         }
//                     }
//                 }
//             }
//         } else {
//             return response(404, 0, "Please fill all fields", res);
//         }
//     } catch (err) {
//         console.log(err);
//         return response(404, 0, err.message, res);
//     }
// };

exports.multipleDaysPrices = async(req, res, next) => {
    try {
        if (req.body.totalDays || req.body.travelInfo) {
            let totalDistance = 0;
            let rDistance = 250 * req.body.totalDays;
            const travelInfo = req.body.travelInfo;
            let carModel = ["SUV", "SEDAN", "TRAVELER"];
            let allCarPrice = [];
            for (i = 0; i < carModel.length; i++) {
                let car = carModel[i];
                let allCar = [];
                for (k = 0; k < travelInfo.length; k++) {
                    let place = travelInfo[k];
                    let stateName = place.Sstate;
                    let carName = carModel[i];
                    placeName = await PlacePrice.find({
                        $and: [{ place: stateName }, { carModel: carName }],
                    });
                    if (placeName.length > 0) {
                        placeName[0].price = placeName[0].price * place.day;
                        allCar.push(placeName[0]);

                        totalDistance = place.distance + totalDistance;
                    } else {
                        LikeName = await PlacePrice.findOne({ place: new RegExp(stateName) })
                        errorMsg = ' We are not providing our service in ' + stateName;
                        return response(200, 0, errorMsg, res);
                    }
                    if (k == travelInfo.length - 1) {
                        if (i == carModel.length - 1) {
                            allCarPrice.push(allCar);
                            // return response(200, 1, allCarPrice, res);
                            helloFunction(req, res, allCarPrice);
                        } else {
                            allCarPrice.push(allCar);
                            allCar = [];
                        }
                    }
                }
            }
        } else {
            console.log(err);
            return response(404, 0, err.message, res);
        }
    } catch (err) {
        console.log(err);
        return response(404, 0, err.message, res);
    }
};

// exports.multiDayPrice = async(req, res, next) => {

//     try {
//         let data = [];

//         if (req.body.totalDays && req.body.dayPlaces && req.body.places) {
//             let days = 0;
//             const totalDays = req.body.totalDays
//             const dayPlaces = req.body.dayPlaces
//             const places = req.body.places;
//             dayPlaces.forEach(async(el) => {
//                 days = days + el.days
//             });
//             console.log(days)

//             if (totalDays == days) {
//                 let i = 1;
//                 const allCarTypes = await CarTypeCount.find().select('-_id carModel');
//                 console.log(allCarTypes)
//                 allCarTypes.forEach(async(el) => {
//                     const allCars = await PlacePrice.find({ $or: places });
//                     data.push(allCars);
//                     if (places.length == i) {
//                         if (data.length > 0) {
//                             let price = 0;
//                             let allRecords = [];
//                             let allPlaces = [];
//                             for (i = 0; i < allCarTypes.length; i++) {
//                                 data[i].forEach(async(el) => {

//                                     dayPlaces.forEach(async(day) => {
//                                         if (el.place == day.place) {

//                                             price = price + (el.price * day.days);
//                                             carModel = el.carModel
//                                             let bPlace = { day: day.days, place: day.place }
//                                             allPlaces.push(bPlace);
//                                         }
//                                     })

//                                 })
//                                 let records = { carModel: carModel, price: price, places: allPlaces }
//                                 price = 0;
//                                 allPlaces = [];
//                                 allRecords.push(records);
//                             }
//                             return response(200, 1, allRecords, res);

//                             console.log(data.length)
//                         } else {
//                             return response(404, 0, 'error', res);
//                         }
//                     } else {
//                         i = i + 1;
//                     }
//                 });
//             } else {
//                 return response(404, 0, 'Total days are not matched', res);
//             }
//         } else {
//             return response(404, 0, 'Please fill all fields', res);
//         }

//     } catch (err) {
//         console.log(err);
//         return response(404, 0, err.message, res);
//     }
// }

exports.oneWayPrice = async(req, res, next) => {
    try {
        let data = [];
        // const places = {
        //     start: 'malda',
        //     end: 'kolkata',
        //     state: 'Meghalaya',
        //     distance: 301
        // }
        if (
            req.body.start &&
            req.body.end &&
            req.body.Sstate &&
            req.body.distance &&
            req.body.date
        ) {
            const place = {
                start: req.body.start,
                end: req.body.end,
                state: req.body.Sstate,
                distance: req.body.distance,
            };

            const allCars = await PlacePrice.find({ place: req.body.Sstate }).select(
                "carModel perKmPrice"
            );
            let cars = [];
            // console.log(allCars)
            for (i = 0; i < allCars.length; i++) {
                const car = {};
                car.carModel = allCars[i].carModel;
                car.availability = parseInt(Math.random() * 10);

                car.extra = await Includes.find({
                    carModel: allCars[i].carModel,
                }).select("includes excludes passenger luggage");

                console.log(car.carModel);
                console.log(car.carExInfo);
                car.perKmPrice = allCars[i].perKmPrice * req.body.distance * 2;
                cars.push(car);
            }
            return response(200, 1, cars, res);
        } else {
            return response(400, 0, "Please fill all fields", res);
        }
    } catch (err) {
        console.log(err);
        return response(404, 0, err.message, res);
    }
};

exports.getQuote = async(req, res, next) => {
    try {
        console.log(req.authUser);
        authUser = req.authUser;
        if (authUser.role == "agent") {
            authUserId = authUser.id;

            if (req.body.carModel && req.body.travelInfo && req.body.price) {
                const data = {
                    carModel: req.body.carModel,
                    travelInfo: req.body.travelInfo,
                    price: req.body.price,
                    userId: authUserId,
                    totalDays: req.body.totalDays,
                };
                const quote = await GetQuote.create(data);
                if (quote) {
                    return response(201, 1, "We will contact you shortly", res);
                }
            } else {
                return response(404, 0, "Please fill all fields", res);
            }
        } else {
            return response(404, 0, "not authorized", res);
        }
    } catch (err) {
        console.log(err);
        return response(404, 0, err.message, res);
    }
};

// RAZORPAY ORDER CREATE
exports.createOrder = async(req, res) => {
    console.log(process.env.KEY_ID, process.env.KEY_SECRET);
    let amount = req.body.amount;
    amount = req.body.amount * 100;
    console.log(amount);
    let instance = new Razorpay({
        // key_id: "rzp_test_pLeJZKECvw4lZM",
        // key_secret: "RmcoYFt33WzBhC3I3rsb8G1C",

        key_id: process.env.KEY_ID,
        key_secret: process.env.KEY_SECRET,
    });

    let options = {
        amount: amount, // amount in the smallest currency unit
        currency: "INR",
        receipt: "HthCabs" + getRandomInt(25250) + getRandomInt(25250),
    };
    console.log(options.receipt);
    instance.orders.create(options, async(err, order) => {
        2;
        if (err) {
            return res.status(400).json({ status: 0, err });
        } else {
            return res
                .status(200)
                .json({ status: 1, order_id: order.id, receipt: options.receipt });
        }
    });
};


exports.verifySignature = async(req, res) => {
    if (
        req.body.razorpay_order_id ||
        req.body.razorpay_payment_id ||
        req.body.razorpay_signature
    ) {
        let body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
        let expectedSignature = crypto
            .createHmac("sha256", process.env.KEY_SECRET)
            .update(body.toString())
            .digest("hex");
        let response = { signatureIsValid: "false" };
        if (expectedSignature === req.body.razorpay_signature) {
            response = { signatureIsValid: "true" };
            return res.status(200).json({ status: 1, msg: "Payment Success" });
        } else {
            return res.status(400).json({ status: 0, msg: "Payment Failed" });
        }
    } else {
        return res
            .status(400)
            .json({ status: 0, message: "Please fill all fields" });
    }
};

exports.booking = async(req, res, next) => {
    try {
        // console.log(new Date().getTime());
        // return;
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
        ) {
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
                created_at: createdAt,
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
                const bookingInsert = await Booking.create(data);
                if (bookingInsert) {
                    let options = {
                        email: req.authUser.email,
                        subject: 'Booking Confirmation',
                        message: `Dear Customer,<br>
                        Your booking is confirmed<br><br>
                        <b>PNRNO:${bookingInsert.pnrno},<br>
                        Booking Date: ${new Date(bookingInsert.created_at ?? '')},<br>
                        Start date: ${new Date(bookingInsert.bookingDate ?? '')},<br>
                        Pickup Time: ${bookingInsert.pickupTime ?? ''},<br>
                        Pickup Location: ${bookingInsert.pickupLocation ?? ''},<br>
                        Total Days: ${bookingInsert.totalDays ?? ''},</b><br><br>

                        Please <b><a href="${process.env.LIVE_URL}/agent/qrCode/${bookingInsert.pnrno}">click here</a></b> open your vehicle verification QR code. You need to scan before trip start with driver for verify your trip. After verification your trip will be start. Wish you a happy journey. 
                        <br><br>Regards 
                        <br>HTH CABS support team`
                        
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
        const allBooking = await Booking.find({ userId: req.authUser.id }).populate("car", "registration.CarNumber").populate("driver");
        if (allBooking) {
            return response(200, 1, allBooking, res);
        } else {
            return response(404, 0, "No result found", res);
        }
    } catch (err) {
        console.log(err);
        return response(404, 0, err.message, res);
    }
};

exports.bookingPayment = async(req, res, next) => {
    try {
        if (req.body.amount || req.body.paymentId || req.body.date) {
            const update = await Booking.updateOne({ _id: req.params.id }, {
                $push: {
                    payment: {
                        amount: req.body.amount,
                        paymentId: req.body.paymentId,
                        date: req.body.date,
                    },
                },
            });
            if (update) {
                const bookingUpdate = await Booking.findOne({
                    _id: req.params.id,
                }).populate("Car");
                return response(200, 1, bookingUpdate, res);
            }
        } else {
            return response(404, 0, "Please fill all fields", res);
        }
    } catch (err) {
        console.log(err);
        return response(404, 0, err.message, res);
    }
};

exports.sendsms = async(req, res) => {
    const otp = 1234
    const amount = 500
    var options = {
        method: "GET",
        url: "http://smshome.co.in",
        qs: {
            AUTH_KEY: "a86c8a4b37e5cb78787d32661fe8de6d",
            message: `Dear customer, Thank you for choosing us, your booking is confirmed with us ref id ${otp}we have received your advance payment Rs ${amount}we will be send you vehicle details within 30 minutes.`,
            senderId: "HTHTRS",
            routeId: "8",
            mobileNos: "8617063982",
            smsContentType: "english",
        },
        headers: { "Cache-Control": "no-cache" },
    };

    Request(options, function(error, response, body) {
        if (error) throw new Error("hello");
        console.log(body);
        return res.status(200).json({ data: response });

    });
};

exports.getIncludes = async(req, res, next) => {
    try {
        const includes = await Includes.find();
        if (includes) {
            return response(200, 1, includes, res);
        } else {
            return response(400, 0, "Data not found", res);
        }
    } catch (err) {
        console.log(err);
        return response(404, 0, err.message, res);
    }
};

exports.register = async(req, res, next) => {
    try {
        if (
            req.body.name &&
            req.body.businessName &&
            req.body.phone &&
            req.body.email
        ) {
            const data = {
                name: req.body.name,
                businessName: req.body.businessName,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
                designation: req.body.designation,
            };
            const register = await Register.create(data);
            if (register) {
                return response(200, 1, register, res);
            } else {
                return response(400, 0, "Something Error", res);
            }
        }
    } catch (err) {
        console.log(err);
        return response(404, 0, err.message, res);
    }
};

exports.stateName = async(req, res, next) => {
    try {
        const stateName = await PlacePrice.distinct("place");
        if (stateName) {
            return response(200, 1, stateName, res);
        } else {
            return response(400, 0, "Something Error", res);
        }
    } catch (err) {
        console.log(err);
        return response(404, 0, err.message, res);
    }


}


exports.qrCode = async(req, res, next) => {
    try {
        console.log(req.params.id)
        if (req.params.id) {
            console.log(req.params.id)
            const id = req.params.id.toString();
            const getData = await Booking.find({ pnrno: id });
            console.log(getData);
            if (getData) {
                const data = {
                    id: getData[0].id
                }
                let stringData = JSON.stringify(data);
                QRCode.toDataURL(stringData, async(err, src) => {
                    if (err) {
                        return res.status(404).send('Something error');
                    } else {
                        console.log(src)
                        res.render('qrCode', {
                            qr_code: src,
                            name: getData[0].travelerInfo.travelerName
                        });

                    }

                });
            }
        }
    } catch (err) {
        console.log(err);
        return response(404, 0, err.message, res);
    }
}



// TEST PAYMENT




exports.createOrderTest = async(req, res) => {
    console.log(process.env.KEY_ID, process.env.KEY_SECRET);
    let amount = req.body.amount;
    amount = req.body.amount * 100;
    console.log(amount);
    let instance = new Razorpay({
        key_id: "rzp_test_pLeJZKECvw4lZM",
        key_secret: "RmcoYFt33WzBhC3I3rsb8G1C",

        // key_id: process.env.KEY_ID,
        // key_secret: process.env.KEY_SECRET,
    });

    let options = {
        amount: amount, // amount in the smallest currency unit
        currency: "INR",
        receipt: "HthCabs" + getRandomInt(25250) + getRandomInt(25250),
    };
    console.log(options.receipt);
    instance.orders.create(options, async(err, order) => {
        2;
        if (err) {
            return res.status(400).json({ status: 0, err });
        } else {
            return res
                .status(200)
                .json({ status: 1, order_id: order.id, receipt: options.receipt });
        }
    });
};


exports.verifySignatureTest = async(req, res) => {
    if (
        req.body.razorpay_order_id ||
        req.body.razorpay_payment_id ||
        req.body.razorpay_signature
    ) {
        let body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
        let expectedSignature = crypto
            .createHmac("sha256", "RmcoYFt33WzBhC3I3rsb8G1C")
            .update(body.toString())
            .digest("hex");
        let response = { signatureIsValid: "false" };
        if (expectedSignature === req.body.razorpay_signature) {
            response = { signatureIsValid: "true" };
            return res.status(200).json({ status: 1, msg: "Payment Success" });
        } else {
            return res.status(400).json({ status: 0, msg: "Payment Failed" });
        }
    } else {
        return res
            .status(400)
            .json({ status: 0, message: "Please fill all fields" });
    }
};

exports.updateArriveStatus = async(req, res, next) => {
    try {
        if(!req.body.pnrno){
            return res.status(200).json({ status: 0, msg: "pnrno Id not found" });
        }
        const update = await Booking.updateOne({ pnrno: req.body.pnrno }, {
            $set: {
                arrived: {
                    arrivedStatus: 1,
                    arrivedTime: new Date(),
                },
            },
        });
        if (update.n == 0) {
            return res.status(200).json({ status: 0, msg: "Status not updated! Please try again." });
        } else {
            console.log(update.n > 0);
            return res.status(201).json({ status: 1, msg: "Status update successfully" });
        }
    } catch (error) {
        return res.status(400).json({ status: 0, msg: error });
    }
}