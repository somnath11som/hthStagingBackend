const express = require('express');

const authController = require('../controllers/authController');
const carController = require('../controllers/carController');
const driverController = require('../controllers/driverController')
const router = express.Router();


router.post("/add-car-details", carController.addCarDetails);

router.get("/allBooking", authController.driverProtected, driverController.getAllBooking);

router.post("/booking-validate", authController.driverProtected, driverController.verifyBooking);

router.post("/complete-journey", authController.driverProtected, driverController.completeJourney);

router.post("/updateLocation", authController.driverProtected, driverController.updateLocation);

router.get("/getCurrentLocation", authController.driverProtected, driverController.getCurrentLocation);

router.get("/driverPayment/:id", authController.driverProtected, driverController.driverPayment);



router.get("/mail", driverController.sendMail);

module.exports = router;