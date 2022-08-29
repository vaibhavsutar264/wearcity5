const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");



//Register user 

exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
        //this variable is written for uploading images for profile pic while registering user
        folder:"avatars",
        width: 150,
        crop: "scale",
    })

    const { name, email, password } = req.body;  //by using req.body it means that we are taking name email password from frontend as a request by use state method 

    const user = await User.create({

        // here we will create a user in backend
        name,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        },
    });

    // now the below lines are given as a function as sendtoken to make files consume less lines its from const token to token, }); of 7 lines in utils folder as jwttoken.js

    // const token = user.getJWTToken(); //here jwt token is called and it is defined in usermodel

    // res.status(201).json({
    //     success: true,
    //     // user,
    //     token,
    // });
    sendToken(user, 201, res); //here this function is called to collect the login token and save it in cookies
});

//lOGIN USER 

exports.loginUser = catchAsyncErrors(async (req, res, next) => {

    const { email, password } = req.body; //it means we will take the details of email and password input from 

    //checking if user has given password and email then

    if (!email || !password) {
        return next(new ErrorHander("Please enter email and password", 400))
    }

    //now we will findout previous user and previous userpassword in below for selecting the password we used select method because in the usermodel password is given as select false so we cannot select it directly so we have selected it by select method

    const user = await User.findOne({ email }).select("+password"); //always use await function when u specify aync in fuction defining

    if (!user) {
        return next(new ErrorHander("indvalid email or password", 401));
        //here 401 is a satuscode for unauthorize request
    }

    const isPasswordMatched = await user.comparePassword(password); //this compare password function is given in usermodel ... this compare password is used to compare the given password in input tag is same as user given password when he was registered so in capare password the parameter given as password is the password given by person while logging details putting from this we will check this password is really the password which we saved in the databases

    if (!isPasswordMatched) {
        return next(new ErrorHander("Invalid email oand password", 401));
    }

    // const token = user.getJWTToken(); //after the password is matched go further with jwttoken and the user will be logged in

    // res.status(200).json({
    //     success: true,
    //     token
    // });
    sendToken(user, 200, res); //here this function is called to collect the login token and save it in cookies
});

// Logout user

exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out"
    });
});

//Forgot password 

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHander("user not found", 404));
    }

    //Get Resetpassword token

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    //now to acccess this hash token to be sent through a link for that 

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`; 
    //in above line req.protocolis https or whatever it is and req.get host is the host of bacckend u needed
    // const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`; 
    //this url is not fix url below line stated url is fixed when u upload or deploy website on vercel ata that time below url will be worked, because at that time frontend and backend port and localhost or host is same
    // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n \n ${resetPasswordUrl} \n \n if you have not requested this email then please ignore it`;

    // now we will use try cath block for sending mail by sendemail function

    try {
        await sendEmail({
            email: user.email,
            subject: `ecommerce password recovery`,
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHander(error.message, 500));
    }
})


//reset password

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    //now we will find this hash token in the databases

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt:Date.now()},
    })

    if (!user) {
        return next(new ErrorHander("Reset password token is invalid or has been expired", 400));
    }

    //but if u got user

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHander("password does not matched", 400));
    }

    user.password = req.body.password ;
    //now as the password is changed then the token should be undefined as done below
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user,200,res);
})


//Get user details

exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
});

//update user password

exports.updatePassword = catchAsyncErrors(async (req,res,next)=>{

    const user = await User.findById(req.user.id).select("+password");
    // here we have used select method for selecting the password because password in the user modele is saved as select false so directly it cannot be selected therefore it hsas been selected by select method
    
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHander("Old password is incorrect",400));
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHander("password does not matched",400));
    }

    user.password = req.body.newPassword;

    await user.save();
    sendToken(user,200,res);

})


//update user  Profile

exports.updateProfile = catchAsyncErrors(async (req,res,next)=>{

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }

    // now for profile pic change we will use cloudinary 

    if(req.body.avatar !==""){
        //means body has certain image
        const user = await User.findById(req.user.id);

        //now for deleting the previous image we need to delete it from cloudinary too

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
            //this variable is written for uploading images for profile pic while registering user
            folder:"avatars",
            width: 150,
            crop: "scale",
        });

        newUserData.avatar ={
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify:false,
    })

    res.status(200).json({
        success:true,
    })

});


//Get all users for the watch of admin 

exports.getAllUser = catchAsyncErrors(async(req,res,next)=>{
    const users = await User.find();

    res.status(200).json({
        success:true,
        users,
    })
});


//Get single user for the watch of admin 

exports.getSingleUser = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHander(`invalid user id: ${req.params.id}`,400))
    }

    //by using req.params.id u need to specify which id u wants to see
    // and by using req.user.id menas id which we wants to fetch from frontend as soon as he gets register

    res.status(200).json({
        success:true,
        user,
    })
});



//Delete User --Admin

exports.deleteUser = catchAsyncErrors(async (req,res,next)=>{

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHander(`user does not exist with id: ${req.params.id}`,400));
    }
    // now we need to destroy the user image 1st from cloudinary then we will delete the user
    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    await user.remove(); 
    //remove is the predefined method for backend for deleting the user

    res.status(200).json({
        success:true,
        message:"deleted user successfully"
    })
})


//update user Roles -- Admin

exports.updateUserRole = catchAsyncErrors(async (req,res,next)=>{

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }

    // now for profile pic change we will use cloudinary and will use it later

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify:false,
    });

    if(!user){
        return next(new ErrorHander(`user does not exist with role: ${req.user.role}`,400));
    }

    res.status(200).json({
        success:true,
    })

});


