const mongoose = require("mongoose");
const dbconnect = () => {
    try {
        const conn = mongoose.connect("mongodb://localhost:27017/ecommerce");
        console.log('database connect successfully')
    } catch (err) {
        throw new Error(err);
    }
}

module.exports = dbconnect;