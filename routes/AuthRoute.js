/**
 *  We set auth end point here, but handling controller separately
 */
const express = require('express');
const router = express.Router();
const {createdUser} = require('../controller/UserController');

router.post('/register', createdUser);

module.exports = router;