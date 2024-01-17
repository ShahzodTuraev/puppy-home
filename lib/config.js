const mongoose = require("mongoose");

exports.member_type_enums = ["USER", "ADMIN", "SHOP"];
exports.member_status_enums = ["ONPAUSE", "ACTIVE", "DELETED"];
exports.product_collection_enums = [
  "food",
  "clothes",
  "toy",
  "beauty",
  "service",
  "etc",
];
exports.product_status_enums = ["PAUSED", "PROCESS", "DELETED"];
exports.product_discount_period_enums = [
  "0",
  "6_hours",
  "1_day",
  "7_days",
  "30_days",
];

exports.notif_status_enums = ["SEEN", "UNSEEN", "DELETED"];
exports.event_status_enums = ["ACTIVE", "DELETED"];
exports.like_view_group_list = ["product", "community"];
exports.order_status_enums = ["PENDING", "PROCESS", "FINISHED", "CANCELLED"];
/*******************************
 *   MONGODB RELATED COMMANDS
 *******************************/
exports.shapeIntoMongooseObjectId = (target) => {
  //mongodb object id ni taminlovchi function
  if (typeof target === "string") {
    return new mongoose.Types.ObjectId(target);
  } else return target;
};
