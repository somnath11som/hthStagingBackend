const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const cors = require("cors");



// const globalErrorHandler = require('./controllers/errorController');
const authRouter = require('./router/authRoute');
const driverRouter = require('./router/driverRoute');
const adminRouter = require('./router/adminRoute');
const tourAgentRouter = require('./router/tourAgentRoute');
const fileUploadRouter = require('./router/fileUploadRouter');
const app = express();
app.use(cors());
app.use("/upload", express.static("upload"));
app.use("/images", express.static("images"));
app.use(bodyParser.urlencoded({extended:false}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const multer = require("multer");

const upload = multer({
  dest:'upload'
});

app.post('/api/v2/image/:name', upload.single('image'), (req, res) => {
  
  res.send(req.params.name);
});


app.use(bodyParser.json());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/driver", driverRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/agent", tourAgentRouter);
app.use("/api/v1/", fileUploadRouter);



app.use((req, res, next) => {
    res.status(404).json({
        status: 0,
        data: "Page not found",
    });
});

module.exports = app;