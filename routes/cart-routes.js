const express = require("express")
const router = express.Router()

const cartController = require("../controllers/cart-controller")

// 127.0.0.1:4040/cart/...
router.get("/",cartController.getcart)
router.post("/items",cartController.addCartItem)
router.patch("/items",cartController.updateCartItem)


module.exports = router