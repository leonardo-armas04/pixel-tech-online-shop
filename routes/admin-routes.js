const express = require("express")
const router = express.Router()

const adminController = require("../controllers/admin-controller")
const imageUploadMiddleware = require("../middlewares/image-upload")

// 127.0.0.1:4040/admin/products
router.get("/products",adminController.getProducts) 
router.get("/products/new",adminController.getNewProduct)
router.post("/products",imageUploadMiddleware,adminController.createNewProduct)
router.get("/products/:id",adminController.getUpdateProduct)
router.post("/products/:id",imageUploadMiddleware,adminController.updateProduct)
router.delete("/products/:id",adminController.deleteProduct)

module.exports = router