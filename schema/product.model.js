const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {
  product_collection_enums,
  product_status_enums,
  product_discount_period_enums,
} = require("../lib/config");
const productSchema = new mongoose.Schema(
  {
    product_name: { type: String, required: true },
    product_collection: {
      type: String,
      required: true,
      enum: {
        values: product_collection_enums,
        message: "{Value} is not among permitted enum values",
      },
    },
    product_status: {
      type: String,
      default: "PAUSED",
      enum: {
        values: product_status_enums,
        message: "{Value} is not among permitted enum values",
      },
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_discount: {
      type: Number,
      default: 0,
    },
    product_discount_period: {
      type: String,
      default: "0",
      enum: {
        values: product_discount_period_enums,
        message: "{Value} is not among permitted enum values",
      },
    },
    product_left_cnt: {
      type: Number,
      required: true,
    },

    product_point: {
      type: Number,
      default: 0,
    },
    product_review: {
      type: Number,
      default: 0,
    },
    product_delivery_cost: {
      type: Number,
      required: true,
    },
    product_description: { type: String, required: true },
    product_images: { type: Array, default: [] },
    product_likes: { type: Number, default: 0 },
    product_views: { type: Number, default: 0 },
    shop_mb_id: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: false,
    },
  },
  { timestamps: true }
);

productSchema.index({ shop_mb_id: 1, product_name: 1 }, { unique: true });
module.exports = mongoose.model("Product", productSchema);
