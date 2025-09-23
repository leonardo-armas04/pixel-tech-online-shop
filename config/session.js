const session = require("express-session")
const MongoDBStore = require("connect-mongodb-session")(session)

const store = new MongoDBStore({
  uri: "mongodb://localhost:27017/online-shop",
  collection: "sessions"
})

store.on('error', function(error) {
  console.log(error)
})

const sessionConfig = {
  secret: "super-secret",
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: { maxAge: 1000*60*60*24*2 } // 2 días
}

module.exports = sessionConfig