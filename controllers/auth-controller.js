function getSignUp(req,res) {
    // A path relative to the views folder 
    // because this is which we configured in the template engine
    res.render("costumer/auth/signup")
}

function getLogin(req,res) {
    // code ...
}

module.exports = {
    getSignUp: getSignUp,
    getLogin: getLogin
}