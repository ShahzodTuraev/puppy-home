const express = require("express");
const router = express.Router();
const memberController = require("./controllers/memberController");
const productController = require("./controllers/productController");
const eventController = require("./controllers/eventController");
const orderController = require("./controllers/orderController");
const followController = require("./controllers/followController");
const communityController = require("./controllers/communityController");
const uploader_community = require("./utils/upload-multer")("community");
const notificationController = require("./controllers/notificationController");

/********************
 *     REST API     *
 ********************/

// Member related routers

router.post("/signup", memberController.signup);
router.post("/login", memberController.login);
router.get("/logout", memberController.logout);
router.get("/check-me", memberController.checkMyAuthentication);
router.get(
  "/member/:id",
  memberController.retrieveAuthMember,
  memberController.getChosenMember
);

router.post(
  "/member-liken",
  memberController.retrieveAuthMember,
  memberController.likeMemberChosen
);

router.post(
  "/liked-products",
  memberController.retrieveAuthMember,
  memberController.myLikedProducts
);

router.post(
  "/review/create",
  memberController.retrieveAuthMember,
  memberController.createReview
);
router.post("/reviews", memberController.getReviews);
// Product related routers

router.post(
  "/products",
  memberController.retrieveAuthMember,
  productController.getAllProducts
);

router.get(
  "/products/:id",
  memberController.retrieveAuthMember,
  productController.getChosenProduct
);

// Event related routes

router.get("/events", eventController.getTargetEvents);

// Service related routers

router.post(
  "/services",
  memberController.retrieveAuthMember,
  productController.getAllServices
);
// Order related routers

router.post(
  "/orders/create",
  memberController.retrieveAuthMember,
  orderController.createOrder
);

router.get(
  "/orders",
  memberController.retrieveAuthMember,
  orderController.getMyOrders
);

router.post(
  "/orders/edit",
  memberController.retrieveAuthMember,
  orderController.editChosenOrder
);

// Community related routers

router.post(
  "/community/create",
  memberController.retrieveAuthMember,
  uploader_community.single("art_image"),
  communityController.createArticle
);

router.get(
  "/community/articles",
  memberController.retrieveAuthMember,
  communityController.getArticles
);

router.get(
  "/community/single-article/:art_id",
  memberController.retrieveAuthMember,
  communityController.getChosenArticle
);

// Following related routers

router.post(
  "/follow/subscribe",
  memberController.retrieveAuthMember,
  followController.subscribe
);

router.post(
  "/follow/unsubscribe",
  memberController.retrieveAuthMember,
  followController.unsubscribe
);

router.get("/follow/followings", followController.getMemberFollowings);

router.get(
  "/follow/followers",
  memberController.retrieveAuthMember,
  followController.getMemberFollowers
);

// Notification related routers

router.get(
  "/receive-notification",
  memberController.retrieveAuthMember,
  notificationController.receiveNotification
);

router.post(
  "/seen-notification",
  memberController.retrieveAuthMember,
  notificationController.seenNotification
);

// Searching related router

router.get("/search-product", productController.searchProduct);
module.exports = router;
