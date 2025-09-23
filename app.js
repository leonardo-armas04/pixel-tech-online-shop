const path = require("path")
const { doubleCsrf } = require("csrf-csrf")
const crypto = require("crypto")
const cookieParser = require("cookie-parser")
const expressSession = require("express-session")

const express = require("express")
const app = express()

const db = require("./database/database")
const errorHandlerMiddleware = require("./middlewares/error-handler")
const createSessionConfig = require("./config/session")
const sessionConfig = createSessionConfig

const {
    generateCsrfToken,
    doubleCsrfProtection
} = doubleCsrf({
    getSecret: (req) => {
        req.session.csrfSecret = crypto.randomBytes(32).toString("hex")
        return req.session.csrfSecret
    },
    getSessionIdentifier: (req) => req.session.id
})

app.set("view engine","ejs") // Use the EJS package
app.set("views",path.join(__dirname,"views")) // Where to find my views

app.use(express.static("public"))
app.use(express.urlencoded({extended: false}))



app.use(expressSession(sessionConfig))
app.use(cookieParser())
app.use(doubleCsrfProtection)
app.use(function (req,res,next) {
    res.locals.csrfToken = generateCsrfToken(req,res)
    next()
})

const authRoutes = require("./routes/auth-routes")

app.use(authRoutes)

app.use(errorHandlerMiddleware)

// .then() to execute code if the promise succeeded
// or .catch() if that promise failed
db.connectToDatabase()
    .then(() => {
        app.listen(4040)
    })
    .catch((error) => {
        console.log("Failed to connect to database!😥")
        console.log(error)
    })