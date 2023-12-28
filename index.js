const express = require('express');
const app = express();
const env = require('dotenv').config();
const PORT = process.env.PORT;
const dbconnect = require('./config/DbConnect');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/AuthRoute');
const productRoute = require("./routes/ProductRoute");
const {notFoundHandler, serverErrorHandler} = require("./middlewares/ErrorHandler");

/* Running server */
dbconnect();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());

app.use('/api/user', authRoute);
app.use('/api/product', productRoute);
app.use(notFoundHandler);
app.use(serverErrorHandler);
app.listen(PORT, () => {
    console.log(`Server running on port : ${PORT}`);
})