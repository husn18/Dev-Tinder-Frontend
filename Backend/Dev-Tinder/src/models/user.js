const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        validate(value) {
            if (value.trim() === '') {
                throw new Error('First name cannot be empty');
            }
        }
    },
    lastname: {
        type: String,
        minlength: 2,
        maxlength: 50,
        validate(value) {
            if (value && value.trim() === '') {
                throw new Error('Last name cannot be empty');
            }
        }
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        default: "this is default email",
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email format');
            }
        }
    },
    phone: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 15,
        validate(value) {
            if(!validator.isMobilePhone(value, 'any')) {
                throw new Error('Invalid phone number format');
            }
        }
    },
    age: {
        type: Number,
        min: 18,
        validate(value) {
            if (!Number.isInteger(value)) {
                throw new Error('Age must be an integer');
            }
        }
    },
    gender: {
        type: String,
        validate(value) {
            const validGenders = ['Male', 'Female', 'Other'];
            if (!validGenders.includes(value)) {
                throw new Error('Invalid gender value');
            }
        },
    },
    password: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        default: []
    },
    location: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        maxlength: 500,
        default: ''
    },
    photoUrl : {
        type: String,
        default: ''
    },
    currentRole: {
        type: String,
        default: ''
    },
    experienceLevel: {
        type: String,
        default: ''
    },
    lookingFor: {
        type: [String],
        default: []
    },
    projects: {
        type: [String],
        default: []
    },
    githubUrl: {
        type: String,
        default: ''
    },
    linkedinUrl: {
        type: String,
        default: ''
    },
    connectionRequests: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        default: []
    }
}, {
    timestamps: true
});

userSchema.methods.toJWT = function() {
    const user = this;
    const payload = {
        userId: user._id
    };
    return jwt.sign(payload, process.env.JWT_SECRET || 'Dev-Tinder@123', { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
};

userSchema.methods.toValidatePassword = function(passwordInput) {
    const user = this;
    return bcrypt.compare(passwordInput, user.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;
