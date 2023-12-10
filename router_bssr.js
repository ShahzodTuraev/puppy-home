const express = require("express");
const router_bssr = express.Router();
const shopController = require("./controllers/shopController");
const productController = require("./controllers/productController");
const uploader_product = require("./utils/upload-multer")("products");
const uploader_member = require("./utils/upload-multer")("members");
/********************
 *     BSSR EJS     *
 ********************/

// member related routers

router_bssr.get("/", shopController.home);
router_bssr
  .get("/sign-up", shopController.getSignupMyShop)
  .post(
    "/sign-up",
    uploader_member.single("shop_img"),
    shopController.signupProcess
  );

router_bssr
  .get("/login", shopController.getLoginMyShop)
  .post("/login", shopController.loginProcess);
router_bssr.get("/logout", shopController.logout);
router_bssr.get("/check-me", shopController.checkSessions);

router_bssr.get(
  "/shop-control",
  shopController.validateAuthShop,
  shopController.getMyShopProducts
);
router_bssr.get("/admin-control", shopController.getAdminControl);

// product related routers

router_bssr.post(
  "/products/create",
  shopController.validateAuthShop,
  uploader_product.array("product_images", 5),
  productController.addNewProduct
);
router_bssr.post(
  "/products/edit/:id",
  shopController.validateAuthShop,
  productController.updateChosenProduct
);

module.exports = router_bssr;
