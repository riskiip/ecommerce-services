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
        throw new Error('ECM-901|User already exist on db|User sudah terdaftar');
    }
});

const loginUserController = asyncHandler(async(req, res) => {
    const {email, password} = req.body;
    const findUser = await User.findOne({email});
    if (findUser && (await findUser.isPasswordMatched(password))) {
        res.json(findUser);
    } else {
        throw new Error('ECM-902|Invalid Email / Password|Username / Password Salah')
    }
})

module.exports = {createdUser, loginUserController};