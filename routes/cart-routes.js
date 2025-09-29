const express = require("express")
const router = express.Router()

const cartController = require("../controllers/cart-controller")

// 127.0.0.1:4040/cart/...
router.post("/items",cartController.addCartItem)

module.exports = router