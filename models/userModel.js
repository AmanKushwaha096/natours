const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
// name , email ,photo ,password , pwd cnfrm

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A user must have a name"],
        unique: true

    },
    email: {
        type: String,
        required: [true, 'A user must have an email Address'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
        type: String,
        default : 'default.jpg'
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    pwd: {
        type: String,
        required: [true, 'A user must have password'],
        minlength: 8,
        select: false
    },
    pwdCnfrm: {
        type: String,
        required: [true, 'Confirm password is must'],
        validate: {
            validator: function (el) {
                return el === this.pwd;
            },
            message: 'Passwords are not the same'
        }
    },
    pwdChangedAt: Date,
    pwdResetToken: String,
    pwdResetExpires: Date,
    active : {
        type :  Boolean ,
        default : true,
        select : false 
    }
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('pwd')) return next();

    this.pwd = await bcrypt.hash(this.pwd, 12);
    this.pwdCnfrm = undefined;
    next();

})

userSchema.pre('save', function (next) {
    if (!this.isModified('pwd') || this.isNew) return next();
    this.pwdChangedAt = Date.now()-1000;
    next();
})

userSchema.pre(/^find/,function(next){
    // this points to current user 
    this.find({active : {$ne : false}} )
    next()
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);

}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.pwdChangedAt) {
        const changedTimeStamp = parseInt(
            this.pwdChangedAt.getTime() / 1000,
            10
          );
        return JWTTimestamp < changedTimeStamp;
    }
    return false;
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.pwdResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.pwdResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;