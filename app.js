const path = require("path")

const express = require("express")
const app = express()

const expressSession = require("express-session")
const csurf = require("csurf")


const db = require("./database/database")
const addCsrfTokenMiddleware = require("./middlewares/csrf-token")
const errorHandlerMiddleware = require("./middlewares/error-handler")
const checkAuthStatusMiddleware = require("./middlewares/check-auth")
const sessionConfig = require("./config/session")
const baseRoutes = require("./routes/base-routes")
const authRoutes = require("./routes/auth-routes")
const productsRoutes = require("./routes/products-routes")


app.set("view engine","ejs") // Use the EJS package
app.set("views",path.join(__dirname,"views")) // Where to find my views

app.use(express.static("public"))
app.use(express.urlencoded({extended: false}))

app.use(expressSession(sessionConfig))

app.use((req, res, next) => {
  if (req.path === "/favicon.ico") return res.status(204).end()
  next()
})

app.use(csurf())
app.use(addCsrfTokenMiddleware)

app.use(checkAuthStatusMiddleware)

app.use(baseRoutes)
app.use(authRoutes)
app.use(productsRoutes)


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