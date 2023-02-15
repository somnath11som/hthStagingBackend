const express = require('express');

const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/signin/:role', authController.signin);
router.post('/sendOtp', authController.sendOtp);
router.post('/verifyOtp', authController.verifyOtp);
router.post('/changePassword', authController.changePassword);
// router.post('/login', authController.login);

// router.get('/add-car-details', driverController.addCarDetails);


// router.post('/forgotPassword', authController.forgotPassword);
// router.patch('/resetPassword/:token', authController.resetPassword);

module.exports = router;