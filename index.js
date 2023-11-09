/* Variable declaration */
// Using express js
const express = require('express');
const app = express();
// Using dotenv
const env = require('dotenv').config();
const PORT = process.env.PORT;
// Using mongoose mongodb
const dbconnect = require('./config/DbConnect');
dbconnect();
// Using bodyparser to parse request header & body
const bodyParser = require('body-parser');
// Reuse Auth Route
const authRoute = require('./routes/AuthRoute');
const {notFoundHandler, serverErrorHandler} = require("./middlewares/ErrorHandler");

/* Running server */
// Parsing request from user
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
// Reroute prefix api/user to Auth Route
app.use('/api/user', authRoute)
app.use(notFoundHandler);
app.use(serverErrorHandler);
// Listen to port
app.listen(PORT, () => {
    console.log(`Server running on port : ${PORT}`);
})