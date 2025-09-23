const path = require("path")

const express = require("express")
const app = express()

const db = require("./database/database")

app.set("view engine","ejs") // Use the EJS package
app.set("views",path.join(__dirname,"views")) // Where to find my views

app.use(express.static("public"))

const authRoutes = require("./routes/auth-routes")

app.use(authRoutes)

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