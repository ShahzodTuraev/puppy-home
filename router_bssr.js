const express = require("express");
const router_bssr = express.Router();
const shopController = require("./controllers/shopController");

/********************
 *     BSSR EJS     *
 ********************/

router_bssr.get("/", shopController.home);
router_bssr
  .get("/sign-up", shopController.getSignupMyShop)
  .post("/sign-up", shopController.signupProcess);

router_bssr
  .get("/login", shopController.getLoginMyShop)
  .post("/login", shopController.loginProcess);
router_bssr.get("/logout", shopController.logout);
router_bssr.get("/check-me", shopController.checkSessions);

router_bssr.get("/shop-control", shopController.getMyShopControl);
router_bssr.get("/admin-control", shopController.getAdminControl);

module.exports = router_bssr;
