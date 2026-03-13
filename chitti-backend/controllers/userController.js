// GET ME
const Conversation = require("../Models/Conversation");
const User = require("../Models/User");
const catchAsync = require("../utilities/catchAsync");

exports.getMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id).select('-password -otp -otp_expiry_time');

    res.status(200).json({
        status: 'success',
        message: 'User Info found successfully!',
        data: {
            user,
        },
    });
});
// UPDATE ME
exports.updateMe = catchAsync(async (req, res, next) => {
    const { name, jobTitle, bio, country } = req.body;
    const { _id } = req.user;


    const updatedUser = await User.findByIdAndUpdate(_id, {
        name,
        jobTitle,
        bio,
        country,
    }, {
        new: true,
        validateModifiedOnly: true,
    }
    );
    res.status(200).json({
        status: 'success',
        message: 'Profile Info updated successfully!',
        data: {
            user: updatedUser
        }
    })
});

// UPDATE AVATAR

exports.updateAvatar = catchAsync(async (req, res, next) => {
    const { avatar } = req.body;
    const { _id } = req.user;


    const updatedUser = await User.findByIdAndUpdate(_id, {
        avatar,
    }, {
        new: true,
        validateModifiedOnly: true,
    }
    );
    res.status(200).json({
        status: 'success',
        message: 'Avatar updated successfully!',
        data: {
            user: updatedUser
        }
    })
});

// UPDATE PASSWORD
exports.updatePassword = catchAsync(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    const { _id } = req.user;

    const user = await User.findById(_id).select('+password');

    if (!(await user.correctPassword(currentPassword, user.password))) {
        return res.status(400).json({
            status: 'error',
            message: 'Current Password is incorrect',
        })

    }

    user.password = newPassword;
    user.passwordChangedAt = Date.now();

    await user.save({});

    res.status(200).json({
        status: 'success',
        message: 'Password updated successfully!',

    })
})

// GET USERS

exports.getUsers = catchAsync(async (req, res, next) => {
    const { _id } = req.user;

    const other_verified_users = await User.find({ _id: { $ne: _id }, verified: true }).select('name avatar _id status');

    res.status(200).json({
        status: 'success',
        message: 'User found successfully!',
        data: {
            users: other_verified_users,
        },
    });
});

// START CONVERSATIONS
exports.startConversation = catchAsync(async (req, res, next) => {
    const { userId } = req.body;
    const { _id } = req.user;

    // Check if a conversation between those two users alreay exists
    let conversation = await Conversation.findOne({
        participants: { $all: [userId, _id] },
    }).populate('messages').populate('participants');

    if (conversation) {
        return res.status(200).json({
            status: 'success',
            data: {
                conversation,
            }
        })
    }
    else {
        // Create a new conversation
        let newConversation = await Conversation.create({
            participants: [userId, _id]
        });
        
        newConversation = await Conversation.findById(newConversation._id).populate('messages').populate('participants'); // Corrected from conversation to Conversation
        

        return res.status(201).json({
            status: 'success',
            data: {
                conversation: newConversation,
            },
        });


    }
});

// GET CONVERSATIONS
exports.getConversations = catchAsync(async (req, res, next) => {
    const { _id } = req.user;

    const conversations = await Conversation.find({
        participants: { $in: [_id] },
    }).populate('messages').populate('participants');

    const validConversations = conversations.filter(
        (c) => c.participants.every((p) => p !== null)
    );

    res.status(200).json({
        status: 'success',
        data: { conversation: validConversations },
    })
});

// CREATE GROUP
exports.createGroup = catchAsync(async (req, res, next) => {
    const { groupName, participants } = req.body;
    const { _id } = req.user;

    const allParticipants = [...new Set([...participants, _id.toString()])];

    let newConversation = await Conversation.create({
        participants: allParticipants,
        isGroup: true,
        groupName,
        groupAdmin: _id,
    });

    newConversation = await Conversation.findById(newConversation._id).populate('messages').populate('participants');

    res.status(201).json({
        status: 'success',
        data: { conversation: newConversation },
    });
});

// BLOCK USER
exports.blockUser = catchAsync(async (req, res, next) => {
    const { userId } = req.body;
    const { _id } = req.user;

    await User.findByIdAndUpdate(_id, { $addToSet: { blockedUsers: userId } });

    res.status(200).json({ status: 'success', message: 'User blocked' });
});

// UNBLOCK USER
exports.unblockUser = catchAsync(async (req, res, next) => {
    const { userId } = req.body;
    const { _id } = req.user;

    await User.findByIdAndUpdate(_id, { $pull: { blockedUsers: userId } });

    res.status(200).json({ status: 'success', message: 'User unblocked' });
});

// SEARCH MESSAGES
exports.searchMessages = catchAsync(async (req, res, next) => {
    const { q, conversationId } = req.query;
    if (!q) return res.status(400).json({ status: 'error', message: 'Query required' });

    const conversation = await Conversation.findById(conversationId).select('messages');
    if (!conversation) return res.status(404).json({ status: 'error', message: 'Conversation not found' });

    const Message = require('../Models/Message');
    const results = await Message.find({
        _id: { $in: conversation.messages },
        content: { $regex: q, $options: 'i' },
    });

    res.status(200).json({ status: 'success', data: { messages: results } });
});

// GET UNREAD COUNT
exports.getUnreadCount = catchAsync(async (req, res, next) => {
    const { _id } = req.user;
    const Message = require('../Models/Message');

    const conversations = await Conversation.find({ participants: { $in: [_id] } }).select('messages lastReadAt');

    const unreadCounts = {};
    for (const conv of conversations) {
        const lastRead = conv.lastReadAt?.get(_id.toString());
        const query = { _id: { $in: conv.messages }, author: { $ne: _id }, seenBy: { $ne: _id } };
        if (lastRead) query.createdAt = { $gt: lastRead };
        const count = await Message.countDocuments(query);
        if (count > 0) unreadCounts[conv._id] = count;
    }

    res.status(200).json({ status: 'success', data: { unreadCounts } });
});