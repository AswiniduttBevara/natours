const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');

//started express
const app = express();

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
//1)global MIDDLEWARES

// For security headers
app.use(helmet());

// Development logging
// console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//Body sanitization aganist NoSQL Query Injection.
app.use(mongoSanitize());

//Body sanitization using xss
app.use(xss());

// Body parser, reading data into body from req.body
app.use(express.json({limit:'10kb'}));
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

// Limit requests from the same API
const limiter = rateLimit({
    limit:2,
    window: 60*60*1000,
    message:"To many requests, please try after an hour"
})

app.use('/api', limiter)
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    
    next(new AppError(`can't find the ${req.originalUrl} on the server`,404));
})

app.use(globalErrorHandler)

module.exports = app;