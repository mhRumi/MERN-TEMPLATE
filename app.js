const express = require("express");
const app = express();
const morgan = require('morgan');

//to acess json data in body
app.use(express.json({ limit: '1000kb' }));

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController'); 

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

const userRoutes = require('./routes/userRoutes');
app.use(express.static(`${__dirname}/public`))

app.use('/api/v1/users', userRoutes);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})

app.use(globalErrorHandler);

module.exports = app;

