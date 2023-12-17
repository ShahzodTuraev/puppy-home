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
    new_member.mb_image = req.file.path.replace(/\\/g, "/");
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
        ? res.redirect("/admin/control")
        : res.redirect("/admin/shop-control");
    });
  } catch (err) {
    res.redirect("/admin/login");
    console.log(`ERROR, cont/login, ${err.message} `);
  }
};

shopController.getAdminControl = async (req, res) => {
  try {
    console.log("GET: cont/getAdminControl");
    const user = new Member(),
      user_data = await user.getAdminControlData();
    res.render("admin-page", { user_data: user_data });
  } catch (err) {
    console.log(`ERROR, cont/getAdminControl, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

shopController.getRequiredUsers = async (req, res) => {
  try {
    console.log("GET: cont/getRequiredUsers");
    const user = new Member(),
      type = req.params.type,
      user_data = await user.getRequiredUsersData(type);
    res.render("admin-page", { user_data: user_data });
  } catch (err) {
    console.log(`ERROR, cont/getRequiredUsers, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

shopController.updateUserByAdmin = async (req, res) => {
  try {
    console.log("POST: cont/updateUserByAdmin");
    console.log("status:::", req.body);
    const member = new Member(),
      result = await member.updateChosenMemberData(req.body);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/updateUserByAdmin, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

shopController.logout = (req, res) => {
  try {
    console.log("GET cont/logout");
    req.session.destroy(function () {
      res.redirect("/admin");
    });
  } catch (err) {
    console.log(`ERROR, cont/logout, ${err.message} `);
  }
};

shopController.updateChosenMember = async (req, res) => {
  try {
    console.log("GET cont/updateChosenMember");
    const member = new Member(),
      result = await member.updateChosenMemberData(req.body);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/updateChosenMember, ${err.message} `);
  }
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
      message: "only authenticated members with shop type",
    });
    // res.redirect("/admin");
  }
};

shopController.validateAdmin = (req, res, next) => {
  if (req.session?.member?.mb_type === "ADMIN") {
    req.member = req.session.member;
    next();
  } else {
    const html = `<script>
                    alert("Admin page: Permission denied!")
                    window.location.replace("/admin")  
                  </script>`;
    res.end(html);
  }
};
