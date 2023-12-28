const Product = require("../models/ProductModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/ValidateMongoDb");

const createProduct = asyncHandler(async(req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    } catch(err) {
        throw new Error(err);
    }
});

const getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllProduct = asyncHandler(async(req, res) => {
    try {
        const allProducts = await Product.find();
        res.json(allProducts);
    } catch (err) {
        throw new Error(err);
    }
})

module.exports = {createProduct, getaProduct, getAllProduct}