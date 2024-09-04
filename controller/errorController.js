const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message,400);
}

const handleDuplicationError = (err) => {
    const value = err.keyValue.name;
    const message = `Duplicate name: ${value}, please change the name`;

    return new AppError(message, 400)
}

const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map(el => el.message).join('. ')
    const message = `invalid Data.: ${errors}`
    return new AppError(message, 400)
}

const handleInvalidToken = () => {
    return new AppError("invalid Token! please login again", 401)
}

const handleExpiredToken = () => {
    return new AppError("Expired Token! please login again", 401)
}

const sendErrorProd = (err, res) => {
    //operational or trusted errors which we can expect

    if(err.isOperational){
        res.status(err.statusCode).json({
            status:err.status,
            message:err.message
        })
    //programming or unknown errors
    }else{
        // console.error(err);
        res.status(err.statusCode).json({
            status:"error",
            message:"something went very wrong",
            // error:err
        })
    }
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status:err.status,
        error:err,
        message:err.message,
        stack:err.stack
    })
};

module.exports = (err, req, res, next) => {
    err.status = err.status || "error";
    err.statusCode = err.statusCode || 500;

    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err, res);

    }else if(process.env.NODE_ENV === 'production'){

        let error = {...err, name:err.name, message:err.message};

        if(error.name === "CastError"){
            error = handleCastErrorDB(error);
        }

        if(error.code === 11000){
            error = handleDuplicationError(error);
        }

        if(error.name === "ValidationError"){
            error = handleValidationError(error);
        }

        if(error.name === 'JsonWebTokenError'){
            error = handleInvalidToken()
        }

        if(error.name === 'TokenExpiredError'){
            error = handleExpiredToken()
        }

        sendErrorProd(error, res);
    } 
}