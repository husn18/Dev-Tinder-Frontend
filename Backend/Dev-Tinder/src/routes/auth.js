const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { validateSignup } = require('../utils/validators');

const USER_SAFE_FIELDS = ['firstname', 'lastname', 'email', 'gender', 'phone', 'age', 'skills', 'photoUrl', 'location', 'bio', 'currentRole', 'experienceLevel', 'lookingFor', 'projects', 'githubUrl', 'linkedinUrl'];

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
};

authRouter.post('/signup', async (req, res) => {
    const allowedFields = [...USER_SAFE_FIELDS, 'password'];
    const receivedFields = Object.keys(req.body);
    const isValidOperation = receivedFields.every((field) => allowedFields.includes(field));

    try {
        if (!isValidOperation) {
            return res.status(400).json({
                message: 'Invalid fields in the request body',
            });
        }

        validateSignup(req);

        if (typeof req.body.skills === 'string') {
            req.body.skills = req.body.skills
                .split(',')
                .map((skill) => skill.trim())
                .filter(Boolean);
        }

        if (typeof req.body.lookingFor === 'string') {
            req.body.lookingFor = req.body.lookingFor
                .split(',')
                .map((tag) => tag.trim())
                .filter(Boolean);
        }

        if (typeof req.body.projects === 'string') {
            req.body.projects = req.body.projects
                .split(',')
                .map((proj) => proj.trim())
                .filter(Boolean);
        }

        if (!req.body.password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        const existingUser = await User.findOne({ email: req.body.email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists. Please login instead.' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const signupData = {
            firstname: req.body.firstname.trim(),
            lastname: req.body.lastname?.trim() || '',
            email: req.body.email.trim().toLowerCase(),
            gender: req.body.gender || '',
            password: hashedPassword,
            phone: req.body.phone.trim(),
            age: req.body.age,
            skills: req.body.skills || [],
            location: req.body.location?.trim() || '',
            bio: req.body.bio?.trim() || '',
            photoUrl: req.body.photoUrl?.trim() || '',
            currentRole: req.body.currentRole?.trim() || '',
            experienceLevel: req.body.experienceLevel || '',
            lookingFor: req.body.lookingFor || [],
            projects: req.body.projects || [],
            githubUrl: req.body.githubUrl?.trim() || '',
            linkedinUrl: req.body.linkedinUrl?.trim() || '',
        };

        const user = new User(signupData);
        await user.save();

        const token = user.toJWT();
        res.cookie('token', token, cookieOptions);

        const safeUser = USER_SAFE_FIELDS.reduce((result, field) => {
            result[field] = user[field];
            return result;
        }, {});

        res.status(201).json({
            message: 'Account created successfully',
            data: safeUser,
            token,
        });
    } catch (err) {
        console.error('Error signing up user:', err);
        res.status(500).json({
            message: 'Error signing up user',
            error: err.message,
            code: err.code,
            errors: err.errors,
        });
    }
});

authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email?.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordMatch = await user.toValidatePassword(password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = user.toJWT();
        res.cookie('token', token, cookieOptions);

        const safeUser = USER_SAFE_FIELDS.reduce((result, field) => {
            result[field] = user[field];
            return result;
        }, {});

        res.json({
            message: 'Login successful',
            data: safeUser,
            token,
        });
    } catch (err) {
        console.error('Error logging in user:', err);
        res.status(500).json({
            message: 'Error logging in user',
            error: err.message,
            code: err.code,
            errors: err.errors,
        });
    }
});

authRouter.post('/logout', (req, res) => {
    res.clearCookie("token", cookieOptions);
    res.send({ message: "Logged out successfully" });
});

module.exports = authRouter;
