const http = require("http");
console.log("Web server is running");
const express = require("express");
const app = express();
const router = require("./router");
const router_bssr = require("./router_bssr");
const cookieParser = require("cookie-parser");
const cors = require("cors");

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
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
// Session codes:
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 720, //for 720 minutes
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

const server = http.createServer(app);
// SOCKET.IO BACKEND SERVER
const io = require("socket.io")(server, {
  serveClient: false,
  origins: "*:*",
  transport: ["websocket", "xhr-polling"],
});

let online_users = 0;
io.on("connection", function (socket) {
  online_users++;

  socket.emit("greetMsg", { text: "welcome" });
  io.emit("infoMsg", { total: online_users });
  socket.on("disconnect", function () {
    online_users--;
    socket.broadcast.emit("infoMsg", { total: online_users });
  });

  socket.on("createMsg", function (data) {
    io.emit("newMsg", data);
  });
});
module.exports = server;
