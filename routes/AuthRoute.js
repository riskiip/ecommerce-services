/**
 *  We set auth end point here, but handling controller separately
 */
const express = require('express');
const router = express.Router();
const {createdUser, loginUserController, inquiryAllUser, inquiryUserById, deleteUserById, updateUser} = require('../controller/UserController');

router.post('/register', createdUser);
router.post('/login', loginUserController);
router.get('/inquiry-all-user', inquiryAllUser);
router.get('/:id', inquiryUserById);
router.delete('/:id', deleteUserById);
router.put('/:id', updateUser);

module.exports = router;