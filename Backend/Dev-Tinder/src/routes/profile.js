const express = require('express');
const profileRouter = express.Router();
const bcrypt = require('bcrypt');
const { userAuth, validateUpdateProfile, validateForgotPassword } = require('../middlewares/userAuth');
const User = require('../models/user');
const USER_SAFE_FIELDS = ['firstname', 'lastname', 'email', 'gender', 'phone', 'age', 'skills', 'photoUrl', 'location', 'bio', 'currentRole', 'experienceLevel', 'lookingFor', 'projects', 'githubUrl', 'linkedinUrl'];

const toSafeUser = (user) => USER_SAFE_FIELDS.reduce((result, field) => {
    result[field] = user[field];
    return result;
}, {});

profileRouter.get('/profile',userAuth, async (req, res) => {
    try{
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phone: user.phone,
            age: user.age,
            gender: user.gender,
            skills: user.skills,
            location: user.location,
            bio: user.bio,
            photoUrl: user.photoUrl,
            currentRole: user.currentRole,
            experienceLevel: user.experienceLevel,
            lookingFor: user.lookingFor,
            projects: user.projects,
            githubUrl: user.githubUrl,
            linkedinUrl: user.linkedinUrl,
        });
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ message: 'Error fetching user profile' });
    }
});

profileRouter.delete('/deleteProfile', userAuth, async (req, res) => {
    try {
        const userId = req.userId;
        await User.findByIdAndDelete(userId);
        res.send('User profile deleted successfully!');
    } catch (err) {
        console.error('Error deleting user profile:', err);
        res.status(500).json({ message: 'Error deleting user profile' });
    }
});

profileRouter.patch('/updateProfile', userAuth, async (req, res) => {
    try {
        validateUpdateProfile(req);
        const userId = req.userId;
        const updateData = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true
        });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(toSafeUser(updatedUser));
    }
    catch (err) {
        console.error('Error updating user:', err);
        res.status(400).json({ message: err.message || 'Error updating user' });
    }
});

profileRouter.patch('/forgotPassword', async (req, res) => {
    const { email, newPassword } = req.body;
    validateForgotPassword(req);
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.send('Password updated successfully!');
    }
    catch (err) {
        console.error('Error updating password:', err);
        res.status(500).json({ message: 'Error updating password' });
    }
});

module.exports = profileRouter;
