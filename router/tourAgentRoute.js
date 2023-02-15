const express = require("express");

const authController = require("../controllers/authController");
const carController = require("../controllers/carController");
const tourAgentController = require("../controllers/tourAgentController");
const router = express.Router();

router.post("/get-all-car", tourAgentController.getAllCar);

router.get("/get-car/:id", tourAgentController.getCar);

router.post("/multiDayPrice", tourAgentController.multipleDaysPrices);

router.post("/oneWayPrice", tourAgentController.oneWayPrice);

router.post(
    "/getQuote",
    authController.protected,
    tourAgentController.getQuote
);

router.post(
    "/createOrder",
    authController.protected,
    tourAgentController.createOrder
);


router.post(
    "/verifyPayment",
    authController.protected,
    tourAgentController.verifySignature
);

router.post(
    "/createOrder-test",
    authController.protected,
    tourAgentController.createOrderTest
);


router.post(
    "/verifyPayment-test",
    authController.protected,
    tourAgentController.verifySignatureTest
);

router.post("/booking", authController.protected, tourAgentController.booking);

router.get(
    "/getAllBooking",
    authController.protected,
    tourAgentController.getAllBooking
);

router.post(
    "/arrivedStatus",
    tourAgentController.updateArriveStatus
);

router.get(
    "/getIncludes",
    authController.protected,
    tourAgentController.getIncludes
);

router.post("/register", tourAgentController.register);

router.get("/sms", tourAgentController.sendsms);

router.post(
    "/bookingPayment/:id",
    authController.protected,
    tourAgentController.bookingPayment
);

router.get(
    "/stateName",
    tourAgentController.stateName
);

router.get("/qrCode/:id", tourAgentController.qrCode);

module.exports = router;