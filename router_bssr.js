const express = require("express");
const router_bssr = express.Router();
const sellerController = require("./controllers/sellerController");

/********************
 *     BSSR EJS     *
 ********************/

router_bssr.get("/", sellerController.home);
router_bssr.get("/sign-up", sellerController.getSignupMyShop);
//   .post("/sign-up", sellerController.signupProcess);

router_bssr.get("/login", sellerController.getLoginMyShop);
//   .post("/login", sellerController.loginProcess);
// router_bssr.get("/logout", sellerController.logout);

module.exports = router_bssr;
