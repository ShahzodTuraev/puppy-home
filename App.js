console.log("Web server is running");
const express = require("express");
const app = express();
const router = require("./router");
const router_bssr = require("./router_bssr");

// DataBase related codes:

// Entrance codes:
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session codes:

// View codes:
app.set("views", "views");
app.set("view engine", "ejs");

// Routing codes:
app.use("/", router); // for restAPI
app.use("/admin", router_bssr); //for BSSR

module.exports = app;
