/* Declare User Model */
const User = require('../models/UserModel');
const asyncHandler = require('express-async-handler');

/**
 * This function is separate from auth route, because we want to focus on user controller only.
 * In this function we set async from request and response. just simple as that
 */
const createdUser = asyncHandler(async(req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({email: email});

    if (!findUser) {
        //     create user
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        throw new Error('RZK-901', 'User already exist on db');
    }
});

module.exports = {createdUser};