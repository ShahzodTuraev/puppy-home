const Event = require("../models/Event");
const Notification = require("../models/Notification");
let eventController = module.exports;
eventController.addNewEvent = async (req, res) => {
  try {
    console.log("POST: cont/addNewEvent");
    const event = new Event(),
      data = req.body,
      result = await event.addNewEventData(data);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/addNewEvent, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

eventController.getAllEvents = async (req, res) => {
  try {
    console.log("GET: cont/getAllEvents");
    const event = new Event(),
      event_list = await event.getAllEventsData(),
      notification = new Notification(),
      receiver_id = req.member._id,
      notification_data = await notification.receiveNotificationData(
        receiver_id
      ),
      event_data = [event_list, notification_data];
    res.render("event-page", { event_data: event_data });
  } catch (err) {
    console.log(`ERROR, cont/getAllEvents, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

eventController.editSelectedEvent = async (req, res) => {
  try {
    console.log("POST: cont/editSelectedEvent");
    const event = new Event(),
      data = req.body,
      id = req.params.id,
      result = await event.editSelectedEventData(id, data);
    console.log(result);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/editSelectedEvent, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

eventController.getTargetEvents = async (req, res) => {
  try {
    console.log("GET: cont/getTargetEvents");
    const event = new Event(),
      page = req.query.page * 1,
      limit = req.query.limit * 1,
      result = await event.getTargetEventsData(page, limit);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getTargetEvents, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};
