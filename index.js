const express = require('express');
const app = express();
const env = require('dotenv').config();
const dbconnect = require('./config/dbconnect');
const PORT = process.env.PORT;

dbconnect();
app.listen(PORT, () => {
    console.log(`Server running on port : ${PORT}`);
})