const express = require("express")
const router = express.Router()

const authController = require("../controllers/auth-controller")

router.get("/signup",authController.getSignUp) // Don't execute the function
router.post("/signup", authController.signUp)
router.get("/login", authController.getLogin)

module.exports = router