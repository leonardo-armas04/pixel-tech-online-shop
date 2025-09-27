const express = require("express")
const router = express.Router()

const adminController = require("../controllers/admin-controller")

// 127.0.0.1:4040/admin/products
router.get("/products",adminController.getProducts) 
router.get("/products/new",adminController.getNewProduct)

module.exports = router