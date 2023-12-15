console.log("Web server is running");
const express = require("express");
const app = express();
const router = require("./router");
const router_bssr = require("./router_bssr");
const cookieParser = require("cookie-parser");

// DataBase related codes:
let session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const store = new MongoDbStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});

// Entrance codes:
app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Session codes:
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 120, //for 120 minutes
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  })
);
app.use((req, res, next) => {
  res.locals.member = req.session.member;
  next();
});
// View codes:
app.set("views", "views");
app.set("view engine", "ejs");

// Routing codes:
app.use("/", router); // for restAPI
app.use("/admin", router_bssr); //for BSSR

module.exports = app;
