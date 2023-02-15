const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const bcrypt = require("bcrypt");



const response = (status, code, msg, res) => {
    return res.status(status).json({ status: code, message: msg });
}

const between = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const createdSendToken = async(user, status, res) => {
    const token = await jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET, {
            expiresIn: '90d',
        }
    );
    return res.status(status).json({ status: 1, token, id:user._id, name: user.name, email: user.email, phone: user.phone, message: "Token generate successfully" });

}


exports.signup = async(req, res, next) => {
    try {
        // if (typeof authUser != undefined) {
        //     if (authUser.role == 'admin') {
        const checkUser = await User.find({ $or: [{ email: req.body.email }, { phone: req.body.phone }] }, (err, result) => {
            console.log(result);
        });
        if (checkUser.length == 0) {
            if (
                req.body.name &&
                req.body.email &&
                req.body.password &&
                req.body.phone &&
                req.body.passwordConfirm &&
                req.body.role
            ) {

                const userRegister = await User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    passwordConfirm: req.body.passwordConfirm,
                    phone: req.body.phone,
                    role: req.body.role,
                });
                if (userRegister) {
                    response(200, 1, 'User register successfully', res)
                } else {
                    response(404, 0, 'Something error', res);
                }
            } else {

                response(400, 0, 'Please enter email and phone', res);
            }

        } else {
            response(400, 0, 'Email or phone already registered', res);
        }
        //     } else {
        //         response(400, 0, 'Unauthorized', res);
        //     }
        // } else {
        //     response(400, 0, 'Unauthorized', res);
        // }
    } catch (err) {
        console.log(err);
        response(404, 0, err, res);
    }

}

exports.signin = async(req, res, next) => {
    try {
        if (req.body.phone && req.body.password) {
            const user = await User.findOne({ phone: req.body.phone }).select('+password');
            console.log(user)
            if (user) {
                if (user.role == req.params.role) {
                    const check = await bcrypt.compare(req.body.password.toString(), user.password);
                    if (user && check) {
                        createdSendToken(user, 200, res)
                    } else {
                        response(404, 0, 'Password does not matched', res)
                    }
                } else {
                    response(404, 0, 'Not authorized', res);
                }
            } else {
                response(404, 0, 'Phone not matched', res);
            }


        } else {
            response(404, 0, 'Please enter Phone number and Password', res)
        }
    } catch (err) {
        console.log(err);
        response(404, 0, err, res)
    }
}

exports.sendOtp = async(req, res, next) => {
    try {
        if (req.body.phone) {
            const checkUser = await User.findOne({ phone: req.body.phone });
            if (checkUser) {
                const otp = '1234';
                const concatOtp = otp.concat('hth');
                const validateOtp = await bcrypt.hash(concatOtp, 12);
                // checkUser.passwordResetToken = validateOtp;
                // checkUser.passwordConfirm = checkUser.password
                passwordResetExpires = Date.now() + 10 * 60 * 1000;
                await User.updateOne({ phone: req.body.phone }, { passwordResetToken: validateOtp, passwordResetExpires })
                    // await checkUser.save({ validateBeforeSave: false });
                return res.status(200).json({ status: 1, message: 'Otp send successfully', otpValidate: validateOtp });
            } else {
                response(400, 0, 'Phone number does not exits in our database', res);
            }

        } else {
            response(400, 0, 'Please enter your phone number', res);
        }
    } catch (err) {
        console.log(err);
        response(404, 0, 'Something Error', res);
    }
}


exports.verifyOtp = async(req, res, next) => {
    try {
        if (req.body.otp && req.body.otpValidate) {
            const otp = req.body.otp.toString();
            const concatOtp = otp.concat('hth');
            const check = await bcrypt.compare(concatOtp, req.body.otpValidate);
            if (check) {
                response(200, 1, 'Otp matched', res);
            } else {
                response(400, 0, 'Otp does not matched', res);
            }
        }
    } catch (err) {
        console.log(err);
        response(400, 0, 'Something error', res);
    }
}

exports.changePassword = async(req, res, next) => {
    console.log(req.body.password)
    console.log(req.body.passwordConfirm)
    console.log(req.body.otpValidate)
    if (req.body.password && req.body.passwordConfirm && req.body.otpValidate) {
        const findUser = await User.findOne({ passwordResetToken: req.body.otpValidate, passwordResetExpires: { $gt: Date.now() } });
        console.log(findUser)
        if (findUser) {
            findUser.password = req.body.password;
            findUser.passwordConfirm = req.body.passwordConfirm;
            findUser.passwordResetToken = undefined;
            findUser.passwordResetExpires = undefined;

            await findUser.save({});

            createdSendToken(findUser, 200, res);

        } else {
            response(400, 0, 'Token expire', res)
        }
    } else {
        response(400, 0, 'Please check all fields', res)
    }
}


exports.protected = async(req, res, next) => {
    try {
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            const token = req.headers.authorization.split(" ")[1];
            if (!token) {
                response(400, 0, 'Auth token not found', res);
            } else {
                const decode = promisify(jwt.verify);
                decode(token, process.env.JWT_SECRET).then((user) => {
                    if (user.role == 'agent') {
                        req.authUser = user;
                        next();
                    } else {
                        response(404, 0, 'Unauthorized', res);
                    }
                }).catch((err) => {
                    console.log(err);
                    if (err.message == "invalid signature") {
                        response(404, 0, 'Unauthorized', res);
                    }
                })
            }
        } else {
            response(400, 0, 'Unauthorized', res);
        }
    } catch (err) {
        console.log(err);
        response(400, 0, 'Something error', res);
    }
}

exports.adminProtected = async(req, res, next) => {
    try {
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            const token = req.headers.authorization.split(" ")[1];
            if (!token) {
                response(400, 0, 'Auth token not found', res);
            } else {
                const decode = promisify(jwt.verify);
                decode(token, process.env.JWT_SECRET).then((user) => {
                    if (user.role == 'admin') {
                        req.authUser = user;
                        // console.log(req.authUser)
                        next();
                    } else {
                        response(404, 0, 'Unauthorized', res);
                    }

                }).catch((err) => {
                    console.log(err);
                    if (err.message == "invalid signature") {
                        response(404, 0, 'Unauthorized', res);
                    }

                })
            }
        } else {
            response(400, 0, 'Unauthorized', res);
        }
    } catch (err) {
        console.log(err);
        response(400, 0, 'Something error', res);
    }
}

exports.driverProtected = async(req, res, next) => {
    try {
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            const token = req.headers.authorization.split(" ")[1];
            if (!token) {
                response(400, 0, 'Auth token not found', res);
            } else {
                const decode = promisify(jwt.verify);
                decode(token, process.env.JWT_SECRET).then((user) => {
                    if (user.role == 'driver') {
                        console.log(user)
                        req.authUser = user;
                        // console.log(req.authUser)
                        next();
                    } else {
                        response(404, 0, 'Unauthorized', res);
                    }

                }).catch((err) => {
                    console.log(err);
                    if (err.message == "invalid signature") {
                        response(404, 0, 'Unauthorized', res);
                    }
                })
            }
        } else {
            response(400, 0, 'Unauthorized', res);
        }
    } catch (err) {
        console.log(err);
        response(400, 0, 'Something error', res);
    }
}