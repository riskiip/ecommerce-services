/**
 *  We set auth end point here, but handling controller separately
 */
const express = require('express');
const router = express.Router();
const {createdUser, loginUserController} = require('../controller/UserController');

router.post('/register', createdUser);
router.post('/login', loginUserController);

module.exports = router;