let memberController = module.exports;

memberController.home = async (req, res) => {
  res.send("home page");
};

memberController.signup = async (req, res) => {
  console.log("POST: cont/signup");
  res.send("you are in sign up page");
};

memberController.login = async (req, res) => {
  console.log("POST: cont/login");
  res.send("you are in login page");
};

memberController.logout = (req, res) => {
  console.log("GET cont/logout");
  res.send("you are in logout page");
};
