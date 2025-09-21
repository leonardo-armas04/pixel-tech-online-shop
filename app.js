const path = require("path")

const express = require("express")
const app = express()

app.set("view engine","ejs") // Use the EJS package
app.set("views",path.join(__dirname,"views")) // Where to find my views

const authRoutes = require("./routes/auth-routes")

app.use(authRoutes)

app.listen(4040)