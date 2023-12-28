/**
 *  We set auth end point here, but handling controller separately
 */
const express = require('express');
const router = express.Router();
const {
    createdUser,
    loginUserController,
    inquiryAllUser,
    inquiryUserById,
    deleteUserById,
    updateUser, blockUser, unblockUser, handleRefreshToken, logout
} = require('../controller/UserController');
const {authMiddleware} = require('./../middlewares/AuthMiddleware');
const {isAdmin} = require("../middlewares/AuthMiddleware");

router.post('/register', createdUser);
router.post('/login', loginUserController);
router.get('/inquiry-all-user', inquiryAllUser);
router.get('/:id', authMiddleware, isAdmin, inquiryUserById);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logout);
router.delete('/:id', deleteUserById);
router.put('/edit-user', authMiddleware, updateUser);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);

module.exports = router;