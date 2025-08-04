const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const template  = mongoose.Schema;
const UserSchema = new template({
    email: {
        type: String,
        required: 'Please enter an email.',
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email.']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password.'],
        minlength: [6, 'Minimum 6 characters.']
    },
    birthDate: {
        type: String,
        required: [true, "Please enter your birth date."]
    },
    firstName: {
        type: String,
        required: [true, 'Please enter your first name.'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, "Please enter your last name."],
        trim: true
    },
    passwordChangeAt: Date,
    activeToken: {
        type: String,
        default: null
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    flats: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'flats'
        }
    ],
    messages: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'messages'
        }
    ],
    favouriteFlats: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'flats'
        }
    ],
    created: {
        type: Date,
        default: Date.now()
    },
    updated: {
        type: Date
    }
})

// UserSchema.pre(/^find/, function(next) {
//     // Only populate if it's not already being populated
//     if (!this._populate) {
//       this.populate({
//         path: 'products',
//         select: 'title description'
//       });
//     }
//     next();
//   });

UserSchema.pre("save", async function(next){
    if(!this.isModified('password')){
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

UserSchema.methods.comparePassword = async function(passwordBody, passwordDB){
    return await bcrypt.compare(passwordBody, passwordDB);
}


UserSchema.methods.isPasswordChanged = async function(jwtTimeStamp){
    if(this.passwordChangeAt){
        const passwordChangedTimestamp = parseInt(this.passwordChangeAt / 1000);
        return jwtTimeStamp < passwordChangedTimestamp;
    }

    return false; //password not changed
}

UserSchema.methods.createNewPasswordToken = async function(){
    this.passwordResetToken = await crypto.randomBytes(32).toString("hex");
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
    return this.passwordResetToken;
}

module.exports = mongoose.model("users", UserSchema);

//JWT - JSON WEB TOKEN