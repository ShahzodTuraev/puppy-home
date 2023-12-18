const mongoose = require("mongoose");
const Scheme = mongoose.Schema;
const { notif_status_enums } = require("../lib/config");
const notificationSchema = new mongoose.Schema(
  {
    notif_subject: { required: true, type: String },
    notif_content: { required: true, type: String },
    notif_status: {
      type: String,
      required: false,
      default: "UNSEEN",
      enum: {
        values: notif_status_enums,
        message: "{Value} is not among permitted enum values",
      },
    },
    notif_sender_id: { type: Scheme.Types.ObjectId, required: true },
    notif_receiver_id: { type: Scheme.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
