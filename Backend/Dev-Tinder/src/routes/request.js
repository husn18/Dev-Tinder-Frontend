const express = require('express');
const mongoose = require('mongoose');
const { userAuth } = require('../middlewares/userAuth');
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');

const requestRouter = express.Router();

requestRouter.post(
    '/sendconnectionrequest/:status/:toUserId',
    userAuth,
    async (req, res) => {
        try {
            const { status, toUserId } = req.params;
            const fromUserId = req.userId;

            const allowedStatuses = ['ignored', 'interested'];

            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    message: 'Invalid status'
                });
            }

            if (!mongoose.Types.ObjectId.isValid(toUserId)) {
                return res.status(400).json({
                    message: 'Invalid user id'
                });
            }

            if (fromUserId.toString() === toUserId.toString()) {
                return res.status(400).json({
                    message: 'Cannot send request to yourself'
                });
            }

            const toUser = await User.findById(toUserId);

            if (!toUser) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            const existingRequest = await ConnectionRequest.findOne({
                $or: [
                    {
                        fromUserId: fromUserId.toString(),
                        toUserId: toUserId.toString()
                    },
                    {
                        fromUserId: toUserId.toString(),
                        toUserId: fromUserId.toString()
                    }
                ]
            });

            if (existingRequest) {
                return res.status(400).json({
                    message: 'Connection request already exists'
                });
            }

            const connectionRequest = new ConnectionRequest({
                fromUserId,
                toUserId,
                status
            });

            await connectionRequest.save();

            res.status(201).json({
                message: 'Connection request sent successfully',
                data: connectionRequest
            });

        } catch (err) {
            console.error('Error sending request:', err);

            res.status(500).json({
                message: 'Something went wrong',
                error: err.message
            });
        }
    }
);

requestRouter.post('/connectionrequestresponse/:status/:requestId', userAuth, async (req, res) => {
    try {
        const { status, requestId } = req.params;
        const loggedInUserId = req.userId;

        const allowedStatuses = ['accepted', 'rejected'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: 'Invalid status'
            });
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUserId,
            status: 'interested'
        }).populate('fromUserId', 'firstname lastname age gender skills location bio photoUrl');

        if (!connectionRequest) {
            return res.status(404).json({
                message: 'Connection request not found'
            });
        }

        connectionRequest.status = status;
        await connectionRequest.save();

        res.status(200).json({
            message: 'Connection request response updated successfully',
            data: connectionRequest
        });

    } catch (err) {
        console.error('Error updating request response:', err);

        res.status(500).json({
            message: 'Something went wrong',
            error: err.message
        });
    }
});
module.exports = requestRouter;
