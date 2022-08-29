const ErrorHandler = require("../utils/errorhander");

module.exports = (err, req, res, next)=> {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    //wrong mongodb id entered

    if(err.name === "CastError"){
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message,400);
    }

    //mongoose duplicate key error

    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message,400);
    }

    // wrong jwt error

    if(err.name === "JsonWebTokenError"){
        const message = `json web token is invalid`;
        err = new ErrorHandler(message,400);
    }


    if(err.name === "TokenExpiredError"){
        const message = `json web token is expired`;
        err = new ErrorHandler(message,400);
    }

    res.status(err.statusCode).json({
        //in err.statuscode there is dot between err and statuscode not a comma and also in the status there is only the statuscode 
        success: false,
        message: err.message,
        // error: err,
        // error: err.stack, //here u can use stack as it is defined in utiles error hander as capturestacktrace
    });

};