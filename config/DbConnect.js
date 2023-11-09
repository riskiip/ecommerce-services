/* Variable declaration*/
const mongoose = require("mongoose");

/* Connect to mongodb and declare through variable */
const dbConnect = () => {
    try {
        const conn = mongoose.connect(process.env.MONGODB_URL);
        console.log('database connect successfully')
    } catch (err) {
        throw new Error(err);
    }
}

/* Export module */
module.exports = dbConnect;