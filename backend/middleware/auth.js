const catchAyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHander = require("../utils/errorhander");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
exports.isAuthenticatedUser = catchAyncErrors(async(req,res,next)=>{
     
    const {token} = req.cookies; 
    //when u have logged in the token is genetrated and saved in cookies so based on that we can access that by cookie parser as we have intalled it earlier so token can be accesed by cookie parser so for using cookie parser use it in app.js so it will apply on tjhis function too 

    // console.log(token); 

    if(!token){
        return next(new ErrorHander("Please login to access the resource", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id); //it is taking the id from userModel user.methodes.getjwttoken id which is this._id this is the user id 
    //in this req.user means until the user is logged in we can access all his data

    next();
});

exports.authorizeRoles = (...roles) => {
    // inthis triple dot before roles means roles is an array containing valueas admin and user
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            //above roles is just a name to take all the data from role array and role of user is includes in this req.user.role
            //here req.user.role means the role of user we have provided in the input from frontend 
            return next(
                new ErrorHander(
                    `Role: ${req.user.role} is not allowed to access this resource`,403
                )
            );
        }

        next(); //basically next means do nothing do work as before

    }
}