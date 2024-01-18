const mongoose = require("mongoose");
const { like_view_group_list } = require("../lib/config");
const Scheme = mongoose.Schema;
const reviewScheme = new mongoose.Schema(
  {
    mb_id: { type: Scheme.Types.ObjectId, required: true },
    review_ref_id: { type: Scheme.Types.ObjectId, required: true },
    review_group: {
      type: String,
      required: true,
      enum: { values: like_view_group_list },
    },
    content: { type: String, required: true },
  },
  { timestamps: { createdAt: true } }
);

module.exports = mongoose.model("Review", reviewScheme);
