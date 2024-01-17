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
exports.board_article_status_enum_list = ["active", "deleted"];
/*******************************
 *   MONGODB RELATED COMMANDS
 *******************************/
exports.shapeIntoMongooseObjectId = (target) => {
  if (typeof target === "string") {
    return new mongoose.Types.ObjectId(target);
  } else return target;
};

exports.lookup_auth_member_following = (mb_id, origin) => {
  const follow_id = origin === "follows" ? "$subscriber_id" : "$_id";
  let lookup_obj = {
    $lookup: {
      from: "follows",
      let: {
        lc_follow_id: follow_id,
        lc_subscriber_id: mb_id,
        nw_my_following: true,
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$follow_id", "$$lc_follow_id"] },
                { $eq: ["$subscriber_id", "$$lc_subscriber_id"] },
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            subscriber_id: 1,
            follow_id: 1,
            my_following: "$$nw_my_following",
          },
        },
      ],
      as: "me_followed",
    },
  };
  return lookup_obj;
};
