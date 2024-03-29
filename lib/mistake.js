class Definer {
  // general errors
  static general_err1 = "att: something went wrong!";
  static general_err2 = "att: three is no data with that params!";
  static general_err3 = "att: file upload error!";

  //member auth related errors
  static auth_err1 = "att: mongodb validation is failed!";
  static auth_err2 = "att: jwt token creation error!";
  static auth_err3 = "att: no member with that member nick!";
  static auth_err4 = "att: member password does not match!";
  static auth_err5 = "att: You are not authenticated!";

  //product related errors
  static product_err1 = "att: your credentials do not match!";

  // orders related errors
  static order_err1 = "att: order creation is failed!";
  static order_err2 = "att: order item cration is failed!";
  static order_err3 = "att: no order with that params exists!";

  // notification related errors
  static notif_err1 = "att: notification creation error!";
  static notif_err2 = "att: notification to all creation error!";
  static notif_err3 = "att: notification to selected user creation error!";
  static notif_err4 = "att: notification receiving error!";

  // db related errors
  static mongo_validation_err1 = "att: mongodb validation is failed!";

  // articles related errors
  static article_err1 = "att: auther member for articles not provided!";
  static article_err2 = "att: no article found for that member!";
  static article_err3 = "att: no article found for that target!";

  // follow related errore
  static follow_err1 = "att: self subscription is denied!";
  static follow_err2 = "att: new follow subscription is failed!";
  static follow_err3 = "att: no follow data found!";
}

module.exports = Definer;
