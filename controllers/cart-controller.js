const Product = require("../models/product-model")

function getCart(req,res) {
    res.render("costumer/cart/cart")
}

async function addCartItem(req,res,next) {
    let product
    try {
        product = await Product.findById(req.body.productId)
    } catch (error) {
        next(error)
        return
    }
    const cart = res.locals.cart
    cart.addItem(product)
    req.session.cart = cart
    res.status(201).json({
        message: "Cart updated!😃",
        totalItems: cart.totalQuantity
    })
}

function updateCartItem(req,res) {
    const cart = res.locals.cart
    productId = req.body.productId
    newQuantity = req.body.quantity

    const updatedItemData = cart.updateItem(productId,newQuantity)
    req.session.cart = cart

    res.json({
        message: "Item updated!",
        updatedCartData: {
            newTotalQuantity: cart.totalQuantity,
            newTotalPrice: cart.totalPrice,
            updatedItemPrice: updatedItemData.updatedItemPrice,
            updatedItemQuantity: updatedItemData.updatedItemQuantity
        }
    })
}

module.exports = {
    getcart: getCart,
    addCartItem: addCartItem,
    updateCartItem: updateCartItem
}