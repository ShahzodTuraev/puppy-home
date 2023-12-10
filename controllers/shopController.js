const Member = require("../models/Member");
const Product = require("../models/Product");
const Definer = require("../lib/mistake");
const assert = require("assert");
let shopController = module.exports;

/**************************************
 *      BSSR RELATED METHODS          *
 *************************************/

shopController.home = async (req, res) => {
  try {
    console.log("GET: cont/home");
    res.render("home-page");
  } catch (err) {
    console.log(`ERROR, cont/home, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

shopController.getMyShopProducts = async (req, res) => {
  try {
    console.log("GET: cont/getMyShopProducts");
    const product = new Product(),
      data = await product.getAllProductsDataShop(req.member);
    res.render("shop-page", { shop_data: data });
  } catch (err) {
    console.log(`ERROR, cont/getMyShopProducts, ${err.message} `);
    res.redirect("/admin");
  }
};

shopController.getSignupMyShop = async (req, res) => {
  try {
    console.log("GET: cont/getSignupMyShop");
    res.render("signup");
  } catch (err) {
    console.log(`ERROR, cont/getSignupMyShop, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

shopController.signupProcess = async (req, res) => {
  try {
    console.log("POST: cont/signupProcess");
    let new_member = req.body;
    new_member.mb_type = "SHOP";
    new_member.mb_image = req.file.path;
    const member = new Member(),
      result = await member.signupData(new_member);
    assert.ok(result, Definer.general_err1);
    req.session.member = result;
    res.redirect("/admin/shop-control");
  } catch (err) {
    res.json({ state: "fail", message: err.message });
    console.log(`ERROR, cont/signup, ${err.message} `);
  }
};

shopController.getLoginMyShop = async (req, res) => {
  try {
    console.log("GET: cont/getLoginMyShop");
    res.render("login-page");
  } catch (err) {
    console.log(`ERROR, cont/getLoginMyShop, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

shopController.loginProcess = async (req, res) => {
  try {
    console.log("POST: cont/loginProcess");
    const data = req.body,
      member = new Member(),
      result = await member.loginData(data);

    req.session.member = result;
    req.session.save(() => {
      result.mb_type === "ADMIN"
        ? res.redirect("/resto/admin-control")
        : res.redirect("/admin/shop-control");
    });
  } catch (err) {
    res.redirect("/resto/login");
    console.log(`ERROR, cont/login, ${err.message} `);
  }
};

shopController.getAdminControl = async (req, res) => {
  try {
    console.log("POST: cont/getAdminControl");
    res.render("admin-page");
  } catch (err) {
    console.log(`ERROR, cont/getLoginMyShop, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

shopController.logout = (req, res) => {
  console.log("GET: cont/logout");
  res.send("you are in logout page");
};

shopController.checkSessions = (req, res) => {
  if (req.session?.member) {
    res.json({ state: "success", data: req.session.member });
  } else {
    res.json({ state: "fail", message: "you are not authentificated" });
  }
};

shopController.validateAuthShop = (req, res, next) => {
  if (req.session?.member?.mb_type === "SHOP") {
    req.member = req.session.member;
    next();
  } else {
    res.json({
      state: "fail",
      message: "only authenticated members with restaurant type",
    });
    // res.redirect("/admin");
  }
};
