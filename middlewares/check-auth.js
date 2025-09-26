function checkAuthStatus(req,res,next) {
    const userId = req.session.userId

    if (!userId) {
        return  next()
    }

    res.locals.userId = userId
    res.locals.isAuth = true
    res.locals.isAdmin = req.session.isAdmin
    next()
}

module.exports = checkAuthStatus