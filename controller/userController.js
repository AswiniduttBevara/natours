const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

function filterData(obj, ...requiredData){

    const newFilteredData = {};
    Object.keys(obj).forEach(el => {
        console.log('el==>',el);
        if(requiredData.includes(el)){
            newFilteredData[el] = obj[el];
        }
    })

    return newFilteredData;
}

exports.getusers = catchAsync(async (req, res, next) => {

    const users = await User.find();
    res.status(200).json({
        status:'success',
        data: {
            users
        }
    })
});

exports.createuser = async (req, res) => {
    const user = await User.create(req.body)
    res.status(200).json({
        status:'success',
        data: {
            user
        }
    })
}

exports.updateMe = catchAsync(async (req, res, next) => {
    // send error if user send data for password or confirm password
    if(req.body.password || req.body.confirmPassword){
        return next(new AppError('This route is not for updating password, to update password use /updatePassword'));
    }

    const updatedData = filterData(req.body, 'name', 'email');

    console.log('updatedData=>',updatedData);

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedData, {
        new:true,
        runValidators:true
    });

    console.log('updatedUser=>',updatedUser);
    

    res.status(200).json({
        status:"success",
        data: {
            user:updatedUser
        }
    });

});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {active:false});

    res.status(204).json({
        status:"success",
        data: null
    })

})

exports.getuser = (req, res) => {
    res.status(500).json({
        status:'error',
        message:"Route is not yet defined"
    })
}
exports.updateuser = (req, res) => {
    res.status(500).json({
        status:'error',
        message:"Route is not yet defined"
    })
}
exports.deleteuser = (req, res) => {
    res.status(500).json({
        status:'error',
        message:"Route is not yet defined"
    })
}