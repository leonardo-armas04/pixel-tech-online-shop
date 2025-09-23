const User = require("../models/user-model")

function getSignUp(req,res) {
    // A path relative to the views folder 
    // because this is which we configured in the template engine
    res.render("costumer/auth/signup")
}

async function signUp(req,res) {
    const user = new User(
        req.body.name,
        req.body["last-name"],
        req.body.email,
        req.body.password,
        req.body.street,
        req.body["postal-code"],
        req.body.city
    )

    if(req.body.password === req.body["confirm-password"]) {
        await user.signUp()
        res.redirect("/login")
    } else {
        res.send("Passwords don't match!")
    }
}

function getLogin(req,res) {
    res.render("costumer/auth/login")
}

module.exports = {
    getSignUp: getSignUp,
    getLogin: getLogin,
    signUp: signUp
}