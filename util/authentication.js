function createUserSession (req,user,action) {
    req.session.userId = user._id.toString()
    req.session.save(action)
    // save is coming from the express-session package
}

function destroyUserSession(req) {
    req.session.userId = null
}

module.exports = {
    createUserSession: createUserSession,
    destroyUserSession: destroyUserSession
}