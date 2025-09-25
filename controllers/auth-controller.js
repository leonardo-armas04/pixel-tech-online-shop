const User = require("../models/user-model")
const authUtil = require("../util/authentication")
const userDetailsAreValid = require("../util/validation")

function getSignUp(req,res) {
    // A path relative to the views folder 
    // because this is which we configured in the template engine
    res.render("costumer/auth/signup")
}

async function signUp(req,res,next) {
    if (!userDetailsAreValid(
        req.body.email,
        req.body.password,
        req.body.name,
        req.body["last-name"],
        req.body.street,
        req.body["postal-code"],
        req.body.city
    )) {
        res.redirect("/signup")
        return
    }

    const user = new User(
        req.body.email,
        req.body.password,
        req.body.name,
        req.body["last-name"],
        req.body.street,
        req.body["postal-code"],
        req.body.city
    )

    try {
        const existAlready = await user.existAlready()
        if (existAlready) {
            res.redirect("/signup")
            return
        }
    } catch (error) {
        next(error)
        return
    }


    if(req.body.password === req.body["confirm-password"]) {
        try {
            await user.signUp()
            res.redirect("/login")
        } catch (error) {
            next(error)
            return
        }
    } else {
        res.redirect("/signup")
        return
    }
}

function getLogin(req,res) {
    res.render("costumer/auth/login")
}

async function login(req,res,next) {
    const user = new User(req.body.email,req.body.password)
    let existingUser
    try {
        existingUser = await user.getUserWithSameEmail()
    } catch (error) {
        next(error)
        return
    }

    if (!existingUser) {
        res.redirect("/login")
        return
    }

    let passwordIsCorrect
    try {
        passwordIsCorrect = await user.comparePassword(existingUser.password)
    } catch (error) {
        next(error)
    }

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