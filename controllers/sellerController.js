const Member = require("../models/Member");
let sellerController = module.exports;

/**************************************
 *      BSSR RELATED METHODS          *
 *************************************/

sellerController.home = async (req, res) => {
  try {
    console.log("GET: cont/home");
    res.render("home-page");
  } catch (err) {
    console.log(`ERROR, cont/home, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

sellerController.getSignupMyShop = async (req, res) => {
  try {
    console.log("GET: cont/getSignupMyShop");
    res.render("signup");
  } catch (err) {
    console.log(`ERROR, cont/getSignupMyShop, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

sellerController.getLoginMyShop = async (req, res) => {
  try {
    console.log("GET: cont/getLoginMyShop");
    res.render("login-page");
  } catch (err) {
    console.log(`ERROR, cont/getLoginMyShop, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};
