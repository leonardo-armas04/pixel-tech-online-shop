const express = require("express")
const router = express.Router()

const orderController = require("../controllers/order-controller")

// 127.0.0.1:4040/orders/...
router.post("/",orderController.addOrder)
router.get("/",orderController.getOrders)
router.get("/success",orderController.getSuccess)
router.get("/cancel",orderController.getCancel)

module.exports = router