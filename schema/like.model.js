const mongoose = require("mongoose");
const { like_view_group_list } = require("../lib/config");
const Scheme = mongoose.Schema;
const likeScheme = new mongoose.Schema(
  {
    mb_id: { type: Scheme.Types.ObjectId, required: true },
    like_ref_id: { type: Scheme.Types.ObjectId, required: true },
    like_group: {
      type: String,
      required: true,
      enum: { values: like_view_group_list },
    },
  },
  { timestamps: { createdAt: true } }
);

module.exports = mongoose.model("Like", likeScheme);
