const Member = require("../models/Member");
let memberController = module.exports;

memberController.signup = async (req, res) => {
  try {
    console.log("POST: cont/signup");
    const data = req.body,
      member = new Member(),
      new_member = await member.signupData(data);
    res.json({ state: "success", data: new_member });
  } catch (err) {
    res.json({ state: "fail", message: err.message });
    console.log(`ERROR, cont/signup, ${err.message} `);
  }
};

memberController.login = async (req, res) => {
  console.log("POST: cont/login");
  res.send("you are in login page");
};

memberController.logout = (req, res) => {
  console.log("GET cont/logout");
  res.send("you are in logout page");
};
