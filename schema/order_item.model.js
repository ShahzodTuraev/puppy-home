const mongoose = require("mongoose");
const Scheme = mongoose.Schema;

const orderItemScheme = new mongoose.Schema(
  {
    item_quantity: { type: Number, required: true },
    item_price: { type: Number, required: true },
    item_delivery_cost: { type: Number, required: true },
    order_id: { type: Scheme.Types.ObjectId, ref: "Order", required: false },
    product_id: {
      type: Scheme.Types.ObjectId,
      ref: "Product",
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderItem", orderItemScheme);
