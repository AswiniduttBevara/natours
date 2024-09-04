const crypto = require('crypto');

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { log } = require('console');
const { type } = require('os');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true, "please provide your name"],
        trim:true
    },
    email:{
        type:String,
        required:[true, "please provide your email"],
        unique:true,
        trim:true,
        lowercase:true,
        validate:[validator.isEmail, "Email is invalid"]
    },
    password:{
        type:String,
        required:[true, "please provide your password"],
        minlength:[8, "password minimum length should be eight characters"],
        trim:true,
        select:false
    },
    confirmPassword:{
        type:String,
        required:true,
        minlength:[8, "password minimum length should be eight characters"],
        trim:true,
        validate:{
            validator: function(cnfrmpswd){
                return this.password === cnfrmpswd
            },
            message:"confirm password should be same as password"
        }
    },
    photo:String,
    role:{
        type: String,
        enum: ['admin','user','guide','lead-guide'],
        default:'user'
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordExpiresAt:Date,
    active:{
        type:Boolean,
        default:true,
        select:false
    }
});

userSchema.pre('save', async function (next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
})

userSchema.pre('save', function(next) {
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function(next){
    this.find({active:{$ne:false}});

    next();
})

userSchema.methods.passwordComparison = async function(candidatePswd, userPswd) {
    return await bcrypt.compare(candidatePswd, userPswd);
}

userSchema.methods.passwordChanged = function(JwtTimeStamp){
    if(this.passwordChangedAt){
        const time = this.passwordChangedAt.getTime()/1000;
        // console.log('time=>', JwtTimeStamp, time);
        return JwtTimeStamp < time;
    }

    return false;
}

userSchema.methods.createPasswordResetToken = function (){
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    console.log({resetToken}, this.passwordResetToken);
    this.passwordExpiresAt = Date.now()+10*60*1000;

    return resetToken;
}
const User = mongoose.model('user', userSchema);

module.exports = User;