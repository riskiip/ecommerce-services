const mongoose = require("mongoose");
const validateMongoDbId = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new Error("ECM-920|This id is not valid or not Found|Id tidak valid");
};
module.exports = validateMongoDbId;