const express = require('express');
const User = require('../models/user');
const { userAuth } = require('../middlewares/userAuth');
const connectionRequest = require('../models/connectionRequest');

const userRouter = express.Router();
const mongoose = require('mongoose');
const USER_SAFE_DATA = 'firstname lastname age gender skills location bio photoUrl currentRole experienceLevel lookingFor projects githubUrl linkedinUrl';

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.userId;
        const connectionRequests = await connectionRequest.find({
            toUserId: loggedInUserId,
            status: 'interested'
        })
        .populate(
               "fromUserId" , USER_SAFE_DATA
        );

        res.status(200).json({
            message: 'Received connection requests retrieved successfully',
            data: connectionRequests
        });
    } catch (err) {
        console.error('Received Requests Error:', err.message);
        res.status(500).json({  
            message: 'Server error while retrieving received connection requests',
            error: err.message
        });
    }
});

userRouter.get('/user/connections' ,userAuth , async (req,res) =>{
    try{
        const loggedInUserId = req.userId;
        const connectionrequests = await connectionRequest.find({
            $or: [
                { fromUserId: loggedInUserId },
                { toUserId: loggedInUserId }
            ],
            status: 'accepted'
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

        const data = connectionrequests.map( (request) => {
            const isFromLoggedInUser = request.fromUserId._id.toString() === loggedInUserId.toString();
            const otherUser = isFromLoggedInUser ? request.toUserId : request.fromUserId;
            return {
                _id: request._id,
                user: otherUser,
                status: request.status,
                createdAt: request.createdAt,
                updatedAt: request.updatedAt
            }; 
        });

        res.status(200).json({
            message: 'Connections retrieved successfully',
            data: data
        });
    }
    catch(err){
        console.error('Connections Error:', err.message);
        res.status(500).json({
            message: 'server error while retrieving connections',
            error: err.message
        })
    }
})

userRouter.get('/user/feed', userAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = Math.min(limit, 50);
        const skip = (page - 1) * limit;
        const loggedInUserId = req.userId;

        const connectionRequests = await connectionRequest.find({
            $or: [
                { fromUserId: loggedInUserId },
                { toUserId: loggedInUserId }
            ]
        });

        const connectedUserIds = connectionRequests.reduce((ids, request) => {
            if (request.fromUserId.toString() === loggedInUserId.toString()) {
                ids.add(request.toUserId.toString());
            } else if (request.toUserId.toString() === loggedInUserId.toString()) {
                ids.add(request.fromUserId.toString());
            }
            return ids;
        }, new Set());
        connectedUserIds.add(loggedInUserId.toString());

        const feedUsers = await User.find({
            _id: { $nin: Array.from(connectedUserIds) }
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.status(200).json({
            message: 'Feed retrieved successfully',
            data: feedUsers
        });
    }
    catch (err) {
        console.error('Feed Error:', err.message);
        res.status(500).json({
            message: 'Server error while retrieving feed',
            error: err.message
        });
    }
});

module.exports = userRouter;
