const mongoose = require("mongoose");
const { event_status_enums } = require("../lib/config");

const eventSchema = new mongoose.Schema(
  {
    event_subject: {
      type: String,
      required: true,
    },
    event_content: {
      type: String,
      required: true,
    },
    event_time: {
      type: Date,
      required: true,
    },
    event_address: {
      type: String,
      required: true,
    },
    event_status: {
      type: String,
      required: false,
      default: "ACTIVE",
      enum: {
        values: event_status_enums,
        message: "{VALUE} is not among permitted values",
      },
    },
  },
  { timestamps: true } //createdAt, updatedAt
);

module.exports = mongoose.model("Event", eventSchema);
