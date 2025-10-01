// const stripe = require('stripe')("some-kind-of-key")

const Order = require("../models/order-model")
const User = require("../models/user-model")

async function getOrders(req,res,next) {
  try {
    const orders = await Order.findAllForUser(res.locals.userId)
    res.render('customer/orders/all-orders', {
      orders: orders,
    })
  } catch (error) {
    next(error)
  }
}

async function addOrder(req,res,next) {
    const cart = res.locals.cart
    let userDocument

    try {
        userDocument = await User.findById(res.locals.userId)
    } catch (error) {
        next(error)
        return
    }

    const order = new Order(cart,userDocument)
    try {
        await order.save()
    } catch (error) {
        next(error)
        return
    }

    req.session.cart = null
    
  const session = await stripe.checkout.sessions.create({
    line_items: cart.items.map((item) => {
      return {
        price_data: {
          currency: 'mxn',
          product_data: {
            name: item.product.title,
          },
          unit_amount: +item.product.price * 100,
        },
        quantity: +item.quantity,
      }
    }),
    mode: 'payment',
    success_url: 'http://localhost:4040/orders/success',
    cancel_url: 'http://localhost:4040/orders/cancel',
  });

  res.redirect(303, session.url)
}

function getSuccess(req,res) {
  res.render("customer/orders/success")
}

function getCancel(req,res) {
  res.render("customer/orders/cancel")
}

module.exports = {
    getOrders: getOrders,
    addOrder: addOrder,
    getSuccess: getSuccess,
    getCancel: getCancel
}