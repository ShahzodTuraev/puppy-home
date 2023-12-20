const Notification = require("../models/Notification");
const Definer = require("../lib/mistake");
const assert = require("assert");
let notificationController = module.exports;

notificationController.sendNotification = async (req, res) => {
  try {
    console.log("POST: cont/sendNotification");
    const notification = new Notification(),
      data = req.body,
      sender = req.member,
      result = await notification.sendNotificationData(sender, data);
    res.json({ state: "success", message: "notification sent successfully!" });
  } catch (err) {
    console.log(`ERROR, cont/sendNotification, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

notificationController.receiveNotification = async (req, res) => {
  try {
    console.log("GET: cont/receiveNotification");
    const notification = new Notification(),
      receiver_id = req.member._id,
      result = await notification.receiveNotificationData(receiver_id);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/receiveNotification, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

notificationController.seenNotification = async (req, res) => {
  try {
    console.log("POST: cont/seenNotification");
    const notification = new Notification(),
      notification_id = req.body.id,
      receiver_id = req.member._id,
      result = await notification.seenNotificationData(
        receiver_id,
        notification_id
      );
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/seenNotification, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};
