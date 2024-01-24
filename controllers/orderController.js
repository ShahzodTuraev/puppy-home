const Order = require("../models/Order");

let orderController = module.exports;
const assert = require("assert");
const Definer = require("../lib/mistake");
const Notification = require("../models/Notification");

orderController.createOrder = async (req, res) => {
  try {
    console.log("POST: cont/createOrder");
    assert.ok(req.member, Definer.auth_err5);
    const order = new Order();
    const result = await order.createOrderData(req.member, req.body);
    res.json({ state: "sucess", data: result });
  } catch (err) {
    console.log(`ERROR, cont/createOrder, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

orderController.getMyOrders = async (req, res) => {
  try {
    console.log("GET: cont/getMyOrders");
    assert.ok(req.member, Definer.auth_err5);
    const order = new Order();
    const result = await order.getMyOrdersData(req.member, req.query);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getMyOrders, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

orderController.editChosenOrder = async (req, res) => {
  try {
    console.log("POST: cont/editChosenOrder");
    assert.ok(req.member, Definer.auth_err5);
    const order = new Order(),
      result = await order.editChosenOrderData(req.member, req.body);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/editChosenOrder, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

orderController.getOrdersAdmin = async (req, res) => {
  try {
    console.log("GET: cont/getOrdersAdmin");
    const orders = new Order(),
      order_data = await orders.getOrdersAdminData(),
      notification = new Notification(),
      receiver_id = req.member._id,
      notification_data = await notification.receiveNotificationData(
        receiver_id
      ),
      data = [order_data, notification_data];
    res.render("orders-page", { orders: data });
  } catch (err) {
    console.log(`ERROR, cont/getOrdersAdmin, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

orderController.editOrdersAdmin = async (req, res) => {
  try {
    console.log("GET: cont/editOrdersAdmin");

    const orders = new Order(),
      order_data = await orders.editOrdersAdminData(req.body),
      notification = new Notification(),
      notif_data = {
        notif_subject: "Order status",
        notif_content: `Your order (order_id: ${req.body.order_id
          .slice(-8)
          .toUpperCase()}) successfully delivered`,
        notif_receiver_id: req.body.mb_id,
      },
      notification_data = await notification.sendNotificationOneData(
        req.member._id,
        notif_data
      );
    res.json({ state: "success", data: "delivered" });
  } catch (err) {
    console.log(`ERROR, cont/editOrdersAdmin, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};
