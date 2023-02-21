const express = require('express');
const bodyParser = require("body-parser");
const authController = require('../controllers/authController');
const carController = require('../controllers/carController');
const adminTourAgentController = require('../controllers/adminTourAgent');
const adminDriverController = require("../controllers/adminDriverControler");
const router = express.Router();
const multer = require("multer");
const path = require('path');
const { route } = require("express/lib/application");
const adminPriceController = require("../controllers/adminPriceController")
const adminBookingController = require("../controllers/adminBookingController");
const admincarController = require("../controllers/adminCarController");
// let urlencode = bodyParser.urlencoded({ extended: false });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images')
  },
  filename: function (req, file, cb) {
    if (!file.originalname.match(/\.(doc|docs|pdf|png|jpg|jpeg)$/)) return cb(new Error ('Please upload image or pdf or doc file only'));
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
})

const upload = multer({ storage: storage })



router.get("/get-all-car", authController.adminProtected, carController.getAllCar);

router.get("/get-car/:id", authController.adminProtected, carController.getCar);

router.post("/add-car-details", authController.adminProtected, carController.addCarDetails);

router.post("/edit-car-details/:id/:name", authController.adminProtected, admincarController.editCarDetails);

router.post("/add-place-price", authController.adminProtected, carController.addPlacePrice);

router.get("/get-place-price", authController.adminProtected, adminPriceController.allPlacePrice);

router.post("/update-place-price/:id", authController.adminProtected, carController.updatePlacePrice);

router.post("/add-car-includes", authController.adminProtected, carController.includes);

router.post("/edit-car-includes/:id", authController.adminProtected, carController.editIncludes);

router.post("/add-car-includes", authController.adminProtected, carController.includes);

router.get("/get-car-includes/", authController.adminProtected, carController.getIncludes);

router.get("/booking", authController.adminProtected, adminBookingController.getAllBooking);

router.post("/booking", authController.adminProtected, adminBookingController.booking);

router.get("/booking/:id", authController.adminProtected, carController.getBooking);
router.post("/booking/:id", authController.adminProtected, adminBookingController.editBooking);

// router.post("/addDriver", authController.adminProtected, carController.addDriver);

router.post("/assignDriver", authController.adminProtected, carController.assignDriver);

router.post("/updateDriverPayment",  authController.adminProtected, carController.updateDriverPayment)

router.get("/getBookingInfo:pnrno", authController.adminProtected, carController.getBookingInfo);

router.get("/booking", authController.adminProtected, adminBookingController.getAllBooking);

router.post("/addTourAgent", authController.adminProtected, adminTourAgentController.addTourAgent);

router.get("/TourAgent", authController.adminProtected, adminTourAgentController.TourAgent);

router.get("/carlist",  authController.adminProtected, carController.getAllCarList);

router.get("/driverDetails",   adminDriverController.DriverDetails);

router.get("/getRegisterReq",   adminTourAgentController.getRegisterReq);

router.get("/approveAgent/:id",   adminTourAgentController.approveAgent);

router.post("/getDistance",  admincarController.getDistance);




router.post('/image/:name/:ex', upload.single('image'), (req, res) => {
  return res.status(200).json({status:1, msg: 'File upload successfully', filePath: req.file.path})
 }, (err, req, res, next)=>{
   res.status(400).send({status: 0, error: err.message})
 });



module.exports = router;