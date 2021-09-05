const express = require("express");
const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean')
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController'); 

// Global MIDDLEWARES
//Set Security HTTP header
app.use(helmet())

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// Dos prevention
const limiter = rateLimit({
    max: 100, // request
    windowMs: 60 * 60 * 1000, // per hour in mili seconds
    message: 'Too many requests from this IP, please try again in an hour!'
})

app.use('/api', limiter);

const userRoutes = require('./routes/userRoutes');

//to acess json data in body
app.use(express.json({ limit: '1000kb' }));
// Data Sanitization against NoSQL query injection
app.use(mongoSanitize())
// Data Sanitizatin against XSS
app.use(xss());
// Prevent parameter polution
app.use(hpp({
    whitelist: ['duplicate parameter name']
}));
app.use(express.static(`${__dirname}/public`))

app.use('/api/v1/users', userRoutes);
// app.get('/', (req, res) => {
//     res.json({
//         message: "Hello"
//     })
// })

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})

app.use(globalErrorHandler);

module.exports = app;

