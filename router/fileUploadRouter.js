const express = require('express');
const bodyParser = require("body-parser");
const authController = require('../controllers/authController');
const carController = require('../controllers/carController');
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "upload/" });
let urlencode = bodyParser.urlencoded({ extended: false });


const imageStorage = multer.diskStorage({
    // Destination to store image     
    destination: '../upload', 
      filename: (req, file, cb) => {
          cb(null, file.fieldname + '_' + Date.now() 
             + path.extname(file.originalname))
            // file.fieldname is name of the field (image)
            // path.extname get the uploaded file extension
    }
});

const imageUpload = multer({
   
    storage: imageStorage,
    limits: {
      fileSize: 10000000000 // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(pdf)$/)) { 
         // upload only png and jpg format
         return cb(new Error('Please upload a PDF'))
       }
       console.log(imageStorage);
     cb(undefined, true)
  }
});

router.post("admin/add-car-details", imageUpload.single('documentFile'),  authController.adminProtected, carController.addCarDetails);



module.exports = router;
