const Product = require("../models/product-model")

async function getAllProducts(req,res,next) {
    try {
        const products = await Product.findAll()
        res.render("costumer/products/all-products",{products:products})
    } catch (error) {
        next(error)
    }
}

async function getProductDetails(req,res,next) {
    try {
        const product = await Product.findById(req.params.id)
        res.render("costumer/products/product-details",{product:product})
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllProducts: getAllProducts,
    getProductDetails: getProductDetails
}