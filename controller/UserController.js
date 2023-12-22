/* Declare User Model */
const User = require('../models/UserModel');
const asyncHandler = require('express-async-handler');
const {generateToken} = require("../config/JwtConfig");

/**
 * This function is separate from auth route, because we want to focus on user controller only.
 * In this function we set async from request and response. just simple as that
 */

// Register user
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

// Login User
const loginUserController = asyncHandler(async(req, res) => {
    const {email, password} = req.body;
    const findUser = await User.findOne({email});
    if (findUser && (await findUser.isPasswordMatched(password))) {
        res.json({
            id: findUser?._id,
            first_name: findUser?.firstName,
            last_name: findUser?.lastName,
            token: generateToken(findUser?._id)
        });
    } else {
        throw new Error('ECM-902|Invalid Email / Password|Username / Password Salah')
    }
});

// Get all user
const inquiryAllUser = asyncHandler(async(req, res) => {
    try {
        const getAllUser = await User.find();
        res.json(getAllUser);
    } catch(err) {
        throw new Error(err)
    }
})

// Get specific user
const inquiryUserById = asyncHandler(async(req, res) => {
    const {id} = req.params;
    try {
        const fetchUser = await User.findById(id);
        res.json({
            fetchUser
        })
    } catch(err) {
        throw new Error(err);
    }
});

// Delete specific user
const deleteUserById = asyncHandler(async(req, res) => {
    const {id} = req.params;
    try {
        const deleteUser = await User.findByIdAndDelete(id);
        res.json({
            deleteUser
        })
    } catch(err) {
        throw new Error(err);
    }
});

// Update user
const updateUser = asyncHandler(async(req, res) => {
    const {id} = req.params;
    try {
        const findUserAndUpdate = await User.findByIdAndUpdate(
            id,
            {
                firstName: req?.body?.firstName,
                lastName: req?.body?.lastName,
                email: req?.body?.email,
                mobile: req?.body?.mobile,
                role: req?.body?.role,
                password: req?.body?.password
            },
            {
                new: true
            }
        );
        res.json(findUserAndUpdate);
    } catch(err) {
        throw new Error(err);
    }
})

module.exports = {createdUser, loginUserController, inquiryAllUser, inquiryUserById, deleteUserById, updateUser};