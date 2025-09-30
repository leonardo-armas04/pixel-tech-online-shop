const User = require("../models/user-model")
const authUtil = require("../util/authentication")
const userDetailsAreValid = require("../util/validation")
const sessionFlash = require("../util/session-flash")

function getSignUp(req,res) {
    let sessionData = sessionFlash.getSessionData(req)

    if (!sessionData) {
        sessionData = {
            email: "",
            password: "",
            name: "",
            lastName: "",
            street: "",
            postalCode: "",
            city: ""
        }
    }
    // A path relative to the views folder 
    // because this is which we configured in the template engine
    res.render("customer/auth/signup",{ inputData: sessionData })
}

async function signUp(req,res,next) {
    const enteredData = {
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        lastName: req.body["last-name"],
        street: req.body.street,
        postalCode: req.body["postal-code"],
        city: req.body.city
    }

    if (!userDetailsAreValid(
        req.body.email,
        req.body.password,
        req.body.name,
        req.body["last-name"],
        req.body.street,
        req.body["postal-code"],
        req.body.city
    )) {
        sessionFlash.flashDataToSession(req, {
            errorMessage: "Please check your input! Data provided incorrect",
            ...enteredData
        }, () => {
            res.redirect("/signup")
        })
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
            sessionFlash.flashDataToSession(req,{
                errorMessage: "A user with this email already exists!😱",
                ...enteredData
            },() => {
                res.redirect("/signup")
            })
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
        sessionFlash.flashDataToSession(req,{
            errorMessage: "Passwords don't match!",
            ...enteredData
        },() => {
            res.redirect("/signup")
        })
        return
    }
}

function getLogin(req,res) {
    let sessionData = sessionFlash.getSessionData(req)

    if (!sessionData) {
        sessionData = {
            email: "",
            password: ""
        }
    }
    res.render("customer/auth/login",{ inputData: sessionData })
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

    const sessionErrorData = {
        errorMessage: "Please check your email and password 🥶",
        email: user.email,
        password: user.password
    }

    if (!existingUser) {
        sessionFlash.flashDataToSession(req,sessionErrorData,() => {
            res.redirect("/login")
        })
        return
    }

    let passwordIsCorrect
    try {
        passwordIsCorrect = await user.comparePassword(existingUser.password)
    } catch (error) {
        next(error)
    }

    if (!passwordIsCorrect) {
        sessionFlash.flashDataToSession(req,sessionErrorData,() => {
            res.redirect("/login")
        })
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