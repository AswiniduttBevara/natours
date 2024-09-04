const {promisify} = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

function jwtSign(id){
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_EXPIRES_IN
    })
}

function sendToken(statusCode, user, res){
    const token = jwtSign(user._id);
    res.status(statusCode).json({
        status:'success',
        token,
        data:{
            user
        }
    });
}

exports.signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        confirmPassword:req.body.confirmPassword,
        passwordChangedAt:req.body.passwordChangedAt,
        role:req.body.role
    });

    sendToken(200, newUser, res);
    // const token = jwtSign(newUser._id);
    // res.status(201).json({
    //     status:"success",
    //     token,
    //     data:{
    //         user:newUser
    //     }
    // })
});


exports.login = catchAsync(async (req, res, next) => {
    // check email and password present or not
    const {email, password} = req.body;

    if(!email || !password){
        return next(new AppError("please enter email and password", 401));
    }

    //check the email and password are valid or not
    const user = await User.findOne({email}).select('+password');
    if(!user || !(await user.passwordComparison(password, user.password))){
        return next(new AppError("email or password is incorrect", 401));
    }

    //send back the token
    sendToken(200, user, res);

    // const token = jwtSign(user._id);
    // res.status(200).json({
    //     status:"success",
    //     token,
    // });

});

exports.protect = catchAsync(async (req, res, next) => {
    //1: Get the token and check if it's there
    // console.log(req.headers);
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token){
        return next(new AppError("please login", 401));
    }

    //2: token verification
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //3: checking user still exists or not
    const currentUser = await User.findById(decoded.id);

    if(!currentUser){
        return next(new AppError("The user belonging to this token no longer exists", 401));
    }

    //4: checking user changed password after token issued
    if(currentUser.passwordChanged(decoded.iat)){
        return next(new AppError("password is changed! please login again", 401));
    }

    req.user = currentUser;

    next();
});

exports.restrict = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new AppError("you are not allowed to do this action", 403))
        }

        next();
    }
}

exports.forgetPassword = catchAsync(async (req, res, next) => {

    //Get the user from the posted email
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return next(new AppError("No user found with this email", 404));
    }
    
    //Generate the reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave:false});
    
    //send the reset token to the email
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`;
    console.log('resetUrl=>',resetUrl);
    const message = `forget your password? please submit a patch request with password and confirm password along with the reset token to the provided url ${resetUrl},\n if don't forget your password please ignore the message!`;

    try{    
        await sendEmail({
            email:user.email,
            subject:"your password reset token valid for 10min",
            message,
        });

        res.status(200).json({
            status:"success",
            message:"reset link is send to your mail"
        });
    }catch(err){
        user.passwordResetToken = undefined;
        user.passwordExpiresAt = undefined;
        await user.save({validateBeforeSave:false});

        return next(new AppError('there is an error while sending the reset url', 500));
    }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
    //encrypt the token received from the body
    const encryptedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    //get the user from database using encrypted token
    const user = await User.findOne({passwordResetToken:encryptedToken, passwordExpiresAt:{$gt:Date.now()}});

    if(!user) return next(new AppError('invalid token or time expired', 400));

        //reset the token and time expiration
        user.passwordExpiresAt = undefined;
        user.passwordResetToken = undefined;
        
        //reset the password
        user.password = req.body.password;
        user.confirmPassword = req.body.confirmPassword;
        
        await user.save();

        // generate jwt
        sendToken(200, user, res);

        // const token = jwtSign(user._id);
        // res.status(200).json({
        //     status:'success',
        //     token
        // });

});

exports.updatePassword = catchAsync(async (req, res, next) => {
    
    //Get user from the collection
    const user = await User.findById(req.user.id).select('+password');

    // check the posted current password is correct or not
    if(!(await user.passwordComparison(req.body.currentPassword, user.password))){
        return next(new AppError('wrong password, please provide correct password', 401));
    }

    //update the password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;

    await user.save();

    //generate token
    sendToken(200, user, res);

    // const token = jwtSign(user._id);
    //     res.status(200).json({
    //         status:'success',
    //         token
    //     });

})

