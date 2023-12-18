const Notification = require("../models/Notification");
const Definer = require("../lib/mistake");
const assert = require("assert");
let shopController = module.exports;

shopController.sendNotification = async (req, res) => {
  try {
    console.log("POST: cont/sendNotification");
    const notification = new Notification(),
      data = req.body,
      sender_id = req.member._id,
      result = await notification.sendNotificationData(sender_id, data);
    res.json({ state: "success", message: "notification sent successfully!" });
    console.log(req.body);
  } catch (err) {
    console.log(`ERROR, cont/sendNotification, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};
