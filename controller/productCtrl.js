const Product = require("../models/productModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongoDbId = require("../utils/validateMongodbId");
const fs = require("fs");
const Blog = require("../models/blogModel");
const cloudinaryUploadImg = require("../utils/cloudinary");
const paypal = require('paypal-rest-sdk');

const {PAYPAL_MODE, PAYPAL_CLIENT_KEY, PAYPAL_SECRET_KEY} = process.env;

paypal.configure({
    'mode': PAYPAL_MODE, //sandbox or live
    'client_id': PAYPAL_CLIENT_KEY,
    'client_secret': PAYPAL_SECRET_KEY
});

const createProduct = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    try {
        const user = await User.findById(_id);
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        const updateUser = await Product.findByIdAndUpdate(newProduct._id,
            {
                createdBy: user?.id
            },
            {
                new: true
            });
        res.json(updateUser);
    } catch (error) {
        throw new Error(error);
    }
});

const updateProduct = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const updateProduct = await Product.findByIdAndUpdate(
            id,
            {
                ministry_status: req.body.ministry_status,
                title: req.body.title,
                description: req.body.description,
                price: req.body.price
            },
            {new: true})
        res.json(updateProduct);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteProduct = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const deleteProduct = await Product.findByIdAndDelete(id);
        res.json(deleteProduct);
    } catch (error) {
        throw new Error(error);
    }
});

const getaProduct = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
});


// const getProductByUser = asyncHandler(async (req, res) => {
//
// })

const getAllProduct = asyncHandler(async (req, res) => {
    try {
        // Filtering
        const queryObj = {...req.query};
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el) => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        let query = Product.find(JSON.parse(queryStr));

        // Sorting

        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort("-createdAt");
        }

        // limiting the fields

        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        } else {
            query = query.select("-__v");
        }

        // pagination

        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) throw new Error("This Page does not exists");
        }
        const product = await query;
        res.json(product);
    } catch (error) {
        throw new Error(error);
    }
});

const addToWishlist = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    const {prodId} = req.body;
    try {
        const user = await User.findById(_id);
        const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
        if (alreadyadded) {
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $pull: {wishlist: prodId},
                },
                {
                    new: true,
                }
            );
            res.json(user);
        } else {
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $push: {wishlist: prodId},
                },
                {
                    new: true,
                }
            );
            res.json(user);
        }
    } catch (error) {
        throw new Error(error);
    }
});

const rating = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    const {star, prodId, comment} = req.body;
    try {
        const product = await Product.findById(prodId);
        let alreadyRated = product.ratings.find(
            (userId) => userId.postedby.toString() === _id.toString()
        );
        if (alreadyRated) {
            const updateRating = await Product.updateOne(
                {
                    ratings: {$elemMatch: alreadyRated},
                },
                {
                    $set: {"ratings.$.star": star, "ratings.$.comment": comment},
                },
                {
                    new: true,
                }
            );
        } else {
            const rateProduct = await Product.findByIdAndUpdate(
                prodId,
                {
                    $push: {
                        ratings: {
                            star: star,
                            comment: comment,
                            postedby: _id,
                        },
                    },
                },
                {
                    new: true,
                }
            );
        }
        const getallratings = await Product.findById(prodId);
        let totalRating = getallratings.ratings.length;
        let ratingsum = getallratings.ratings
            .map((item) => item.star)
            .reduce((prev, curr) => prev + curr, 0);
        let actualRating = Math.round(ratingsum / totalRating);
        let finalproduct = await Product.findByIdAndUpdate(
            prodId,
            {
                totalrating: actualRating,
            },
            {new: true}
        );
        res.json(finalproduct);
    } catch (error) {
        throw new Error(error);
    }
});

const uploadImages = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const {path} = file;
            const newpath = await uploader(path);
            urls.push(newpath);
            fs.unlinkSync(path);
        }
        const findProduct = await Product.findByIdAndUpdate(
            id,
            {
                images: urls.map((file) => {
                    return file;
                }),
            },
            {
                new: true,
            }
        );
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
});

const payProduct = asyncHandler(async (req, res) => {
    try {
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:8888/api/product/success",
                "cancel_url": "http://localhost:8888/api/product/cancel"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "Hotel",
                        "sku": "001",
                        "price": "25.00",
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": "25.00"
                },
                "description": "Hat for the best team ever"
            }]
        };

        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === 'approval_url') {
                        res.json(payment.links[i].href);
                    }
                }
            }
        });
    } catch (error) {
        throw new Error(error);
    }
});

const successPage = asyncHandler(async (req, res) => {
    try {
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;
        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": "25.00"
                }
            }]
        };

        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                throw new Error(error)
            } else {
                res.redirect('http://localhost:4200/jusgola/summary');
            }
        });
    } catch (error) {
        throw new Error(error);
    }
});

const cancelPage = asyncHandler(async (req, res) => {
    try {
        res.render('cancel');
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createProduct,
    getaProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    addToWishlist,
    rating,
    uploadImages,
    payProduct,
    successPage,
    cancelPage
};
