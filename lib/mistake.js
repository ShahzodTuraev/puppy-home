class Definer {
  // general errors
  static general_err1 = "att: something went wrong!";
  static general_err2 = "att: threr is no data with that params!";
  static general_err3 = "att: file upload error!";

  //member auth related errors
  static auth_err1 = "att: mongodb validation is failed!";
  static auth_err2 = "att: jwt token creation error!";
  static auth_err3 = "att: no member with that member nick!";
  static auth_err4 = "att: member password does not match!";

  //product related errors
  static product_err1 = "att: your credentials do not match!";

  // notification related errors
  static notif_err1 = "att: notification creation error!";
  static notif_err2 = "att: notification to all creation error!";
  static notif_err3 = "att: notification to selected user creation error!";
  static notif_err4 = "att: notification receiving error!";
}

module.exports = Definer;
