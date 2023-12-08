const express = require("express");
const router = express.Router();
const memberController = require("./controllers/memberController");

/********************
 *     REST API     *
 ********************/

// member related routers

router.post("/signup", memberController.signup);
router.post("/login", memberController.login);
router.get("/logout", memberController.logout);

module.exports = router;
