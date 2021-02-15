const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

const signToken = id => {
    return  jwt.sign({id: id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup = catchAsync(async(req, res, next) => {

    const newUser = await User.create(req.body)
    const token = signToken(newUser._id);
    res.status(200).json({
       status: 'success',
       token,
       data: {
           user: newUser
       }
    })
});

exports.login = catchAsync(async(req, res, next) => {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password){
        return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({email}).select('+password');

    if(!user || !(await user.correctPassword(password, user.password))){
        return next(new AppError('Incorrect email or password', 401));
    }

    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    });
});

exports.protect = catchAsync(async(req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }

    if(!token){
        return next(new AppError('You are not logged in! Please login to get access.', 401));
    }
    //token verification
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
        return next(new AppError('The user does not exists!', 401));
    }
    // Check if user changed password after the token was issued
    if(currentUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('User recently changed password! Please log in again', 401));
    }
    //GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});

exports.updatePassword = catchAsync(async(req, res, next) => {
    res.status(200).json({
        status: 'success',
        message: 'Hello'
    })
})