const express = require("express");
const router_bssr = express.Router();
const shopController = require("./controllers/shopController");
const productController = require("./controllers/productController");

/********************
 *     BSSR EJS     *
 ********************/

// member related routers

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

// product related routers

router_bssr.post(
  "/products/create",
  shopController.validateAuthShop,
  productController.addNewProduct
);
router_bssr.post(
  "/products/edit/:id",
  shopController.validateAuthShop,
  productController.updateChosenProduct
);

module.exports = router_bssr;
