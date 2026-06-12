const express = require('express');
const adminRouter = express.Router();

adminRouter.get('/', (req, res) => {
    const auth = req.auth || null;
    const isAdmin = auth && auth.isAdmin;
    if (!isAdmin) {
        return res.status(403).send('Access denied. Admins only.');
    }
    res.send('This is the admin route for Dev Tinder!');
});

const userRouter = express.Router();

// userRouter.get('/', (req, res) => {
//     const auth = req.auth || null;
//     const isUser = auth && auth.isUser; 
//     if (!isUser) {
//         return res.status(403).send('Access denied. Users only.');
//     }
//     res.send('This is the users route for Dev Tinder!');
// });
const userAuth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }
    try {
        const decoded = jwt.verify(token, 'Dev-Tinder@123');
        req.auth = { userId: decoded.userId, isUser: true };
        next();
    }
    catch (err) {
        console.error('Error verifying token:', err);
        res.status(400).send('Invalid token.');
    }
};

userRouter.use(userAuth);

module.exports = { adminRouter, userRouter };