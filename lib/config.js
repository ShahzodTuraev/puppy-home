exports.member_type_enums = ["USER", "ADMIN", "SHOP"];
exports.member_status_enums = ["ONPAUSE", "ACTIVE", "DELETED"];
exports.product_collection_enums = [
  "food",
  "dress",
  "toy",
  "beauty",
  "service",
  "etc",
];
exports.product_status_enums = ["PAUSED", "PROCESS", "DELETED"];
exports.product_discount_period_enums = [
  "0",
  "6 hours",
  "1 day",
  "1 week",
  "30 days",
];

/*******************************
 *   MONGODB RELATED COMMANDS
 *******************************/
exports.shapeIntoMongooseObjectId = (target) => {
  //mongodb object id ni taminlovchi function
  if (typeof target === "string") {
    return new mongoose.Types.ObjectId(target);
  } else return target;
};
