const validator = require('validator');

const validateSignup = (req) => {
    const { firstname, lastname, email, gender, password, phone, age } = req.body;

    if (typeof firstname !== 'string' || firstname.trim() === '') {
        throw new Error('First name is required and must be a non-empty string');
    }
    else if (lastname && (typeof lastname !== 'string' || lastname.trim() === '')) {
        throw new Error('Last name must be a non-empty string if provided');
    }
    else if (typeof email !== 'string' || email.trim() === '' || !validator.isEmail(email)) {
        throw new Error('Email is required and must be a non-empty string');
    }
    else if(!validator.isStrongPassword(password)) {
        throw new Error('Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters');
    }
    if (!validator.isEmail(email)) {
        throw new Error('Invalid email format');
    }
};

module.exports = {
    validateSignup
};
