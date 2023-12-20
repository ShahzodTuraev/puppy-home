const NotificationModel = require("../schema/notification.model");
const MemberModel = require("../schema/member.model");
const bcrypt = require("bcryptjs");
const Definer = require("../lib/mistake");
const assert = require("assert");
const { shapeIntoMongooseObjectId } = require("../lib/config");

class Notification {
  constructor() {
    this.notificationModel = NotificationModel;
    this.memberModel = MemberModel;
  }

  async sendNotificationData(sender, data) {
    try {
      const sender_id = sender._id;
      let result;
      result = ["all", "user", "shop", "admin"].includes(data.notif_receiver_id)
        ? await this.sendNotificationAllData(sender_id, data)
        : await this.sendNotificationOneData(sender_id, data);
      assert.ok(result, Definer.notif_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async sendNotificationAllData(sender_id, data) {
    try {
      sender_id = shapeIntoMongooseObjectId(sender_id);
      const notif_subject = data.notif_subject;
      const notif_content = data.notif_content;
      let receivers_array = await this.getUserIdsData(data.notif_receiver_id);
      const notification = receivers_array.map((ele) => {
        return new this.notificationModel({
          notif_subject: notif_subject,
          notif_content: notif_content,
          notif_sender_id: sender_id,
          notif_receiver_id: shapeIntoMongooseObjectId(ele._id),
        }).save();
      });
      return notification;
    } catch (mongo_err) {
      console.log(mongo_err);
      throw new Error(Definer.notif_err2);
    }
  }

  async getUserIdsData(member_type) {
    try {
      let mb_result;
      switch (member_type) {
        case "all":
          mb_result = await this.memberModel
            .find({
              mb_type: { $in: ["USER", "SHOP"] },
              mb_status: { $in: ["ONPAUSE", "ACTIVE"] },
            })
            .exec();
          break;
        case "user":
          mb_result = await this.memberModel
            .find({
              mb_type: "USER",
              mb_status: { $in: ["ONPAUSE", "ACTIVE"] },
            })
            .exec();
          break;
        case "shop":
          mb_result = await this.memberModel
            .find({
              mb_type: "SHOP",
              mb_status: { $in: ["ONPAUSE", "ACTIVE"] },
            })
            .exec();
          break;
        case "admin":
          mb_result = await this.memberModel
            .find({
              mb_type: "ADMIN",
              mb_status: { $in: ["ONPAUSE", "ACTIVE"] },
            })
            .exec();
          break;
      }
      return mb_result;
    } catch (err) {
      throw err;
    }
  }

  async sendNotificationOneData(sender_id, data) {
    try {
      const notif_data = {
          notif_subject: data.notif_subject,
          notif_content: data.notif_content,
          notif_sender_id: shapeIntoMongooseObjectId(sender_id),
          notif_receiver_id: shapeIntoMongooseObjectId(data.notif_receiver_id),
        },
        one_notification = new this.notificationModel(notif_data);
      return one_notification.save();
    } catch (mongo_err) {
      console.log(mongo_err);
      throw new Error(Definer.notif_err2);
    }
  }

  async receiveNotificationData(notif_receiver_id) {
    try {
      notif_receiver_id = shapeIntoMongooseObjectId(notif_receiver_id);
      const result = await this.notificationModel
        .aggregate([
          {
            $match: {
              notif_receiver_id: notif_receiver_id,
              notif_status: "UNSEEN",
            },
          },
          { $sort: { createdAt: -1 } },
          {
            $lookup: {
              from: "members",
              localField: "notif_sender_id",
              foreignField: "_id",
              as: "sender_data",
            },
          },
          { $unwind: "$sender_data" },
        ])
        .exec();
      assert.ok(result, Definer.notif_err4);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async seenNotificationData(receiver_id, notification_id) {
    try {
      let result;
      if (notification_id == "all") {
        receiver_id = shapeIntoMongooseObjectId(receiver_id);
        result = await this.notificationModel.updateMany(
          { notif_receiver_id: receiver_id, notif_status: "UNSEEN" },
          { notif_status: "SEEN" }
        );
      } else {
        notification_id = shapeIntoMongooseObjectId(notification_id);
        result = await this.notificationModel
          .findByIdAndUpdate(
            { _id: notification_id },
            { notif_status: "SEEN" },
            {
              runValidators: true,
              lean: true,
              returnDocument: "after",
            }
          )
          .exec();
      }

      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Notification;
