const express = require("express");
const {
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
} = require("../controller/productCtrl");
const {isAdmin, authMiddleware} = require("../middlewares/authMiddleware");
const {uploadPhoto, productImgResize} = require("../middlewares/uploadImage");
const router = express.Router();

router.post("/", createProduct);

router.get("/product/:id", getaProduct);
router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, rating);

router.put("/:id", updateProduct);
router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array("images", 10), productImgResize, uploadImages);
router.delete("/:id", deleteProduct);

router.get("/", getAllProduct);
router.post('/pay', payProduct);
router.get('/success', successPage);
router.get('/cancel', cancelPage);

module.exports = router;
