const jwt = require('jsonwebtoken');
const validator = require('validator');

const userAuth = (req, res, next) => {
    try {
        let token = req.cookies.token;
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization.trim();
            if (authHeader.toLowerCase().startsWith('bearer ')) {
                token = authHeader.slice(7).trim();
            }
        }

        if (!token) {
            return res.status(401).json({ 
                message: 'Unauthorized: No token provided',
                error: 'Token missing'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'Dev-Tinder@123');
        req.user = decoded; // Attach decoded user info to request
        req.userId = decoded.userId; // Attach userId for easy access
        
        next();
    } catch (err) {
        console.error('Auth Error:', err.message);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Unauthorized: Token expired',
                error: 'Token expired'
            });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: 'Unauthorized: Invalid token',
                error: 'Invalid token'
            });
        }
        res.status(401).json({ 
            message: 'Unauthorized',
            error: err.message
        });
    }
};

const validateUpdateProfile = (req) => {
    const allowedFields = ['firstname', 'lastname', 'phone', 'age', 'gender', 'skills', 'location', 'bio', 'photoUrl', 'currentRole', 'experienceLevel', 'lookingFor', 'projects', 'githubUrl', 'linkedinUrl'];
    const receivedFields = Object.keys(req.body);
    const isValidOperation = receivedFields.every((field) => allowedFields.includes(field));
    if (!isValidOperation) {
        throw new Error('Invalid fields in the request body');
    }

    if (req.body.skills && typeof req.body.skills === 'string') {
        req.body.skills = req.body.skills
            .split(',')
            .map((skill) => skill.trim())
            .filter(Boolean);
    }

    if (req.body.lookingFor && typeof req.body.lookingFor === 'string') {
        req.body.lookingFor = req.body.lookingFor
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean);
    }

    if (req.body.projects && typeof req.body.projects === 'string') {
        req.body.projects = req.body.projects
            .split(',')
            .map((proj) => proj.trim())
            .filter(Boolean);
    }

    if (req.body.age && (typeof req.body.age !== 'number' || req.body.age < 18)) {
        throw new Error('Age must be a number and at least 18');
    }

    if (req.body.phone && typeof req.body.phone !== 'string') {
        throw new Error('Phone must be a string');
    }

    if (req.body.gender && typeof req.body.gender !== 'string') {
        throw new Error('Gender must be a string');
    }

    if (req.body.photoUrl && typeof req.body.photoUrl !== 'string') {
        throw new Error('Photo URL must be a string');
    }

    if (req.body.location && typeof req.body.location !== 'string') {
        throw new Error('Location must be a string');
    }

    if (req.body.bio && typeof req.body.bio !== 'string') {
        throw new Error('Bio must be a string');
    }

    if (req.body.firstname && typeof req.body.firstname !== 'string') {
        throw new Error('First name must be a string');
    }

    if (req.body.lastname && typeof req.body.lastname !== 'string') {
        throw new Error('Last name must be a string');
    }

    if (req.body.currentRole && typeof req.body.currentRole !== 'string') {
        throw new Error('Current role must be a string');
    }

    if (req.body.experienceLevel && typeof req.body.experienceLevel !== 'string') {
        throw new Error('Experience level must be a string');
    }

    if (req.body.githubUrl && typeof req.body.githubUrl !== 'string') {
        throw new Error('GitHub URL must be a string');
    }

    if (req.body.linkedinUrl && typeof req.body.linkedinUrl !== 'string') {
        throw new Error('LinkedIn URL must be a string');
    }
};

const validateForgotPassword = (req) => {
    const { email, newPassword } = req.body;

    if (typeof email !== 'string' || email.trim() === '' || !validator.isEmail(email)) {
        throw new Error('Email is required and must be a valid email address');
    }

    if (typeof newPassword !== 'string' || newPassword.trim() === '') {
        throw new Error('New password is required');
    }

    if (!validator.isStrongPassword(newPassword, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
        throw new Error('Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters');
    }
};

module.exports = { userAuth, validateUpdateProfile, validateForgotPassword };
