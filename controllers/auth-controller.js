const User = require("../models/user-model")
const authUtil = require("../util/authentication")

function getSignUp(req,res) {
    // A path relative to the views folder 
    // because this is which we configured in the template engine
    res.render("costumer/auth/signup")
}

async function signUp(req,res) {
    const user = new User(
        req.body.email,
        req.body.password,
        req.body.name,
        req.body["last-name"],
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

async function login(req,res) {
    const user = new User(req.body.email,req.body.password)
    const existingUser = await user.getUserWithSameEmail()

    if (!existingUser) {
        res.redirect("/login")
        return
    }

    const passwordIsCorrect = await user.comparePassword(existingUser.password)

    if (!passwordIsCorrect) {
        res.redirect("/login")
        return
    }

    authUtil.createUserSession(req,existingUser,() => {
        res.redirect("/")
    })

}

function logout(req,res) {
    authUtil.destroyUserSession(req)
    res.redirect("/")
}

module.exports = {
    getSignUp: getSignUp,
    getLogin: getLogin,
    signUp: signUp,
    login: login,
    logout: logout
}