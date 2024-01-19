const EventModel = require("../schema/event.model");
const Definer = require("../lib/mistake");
const assert = require("assert");
const { shapeIntoMongooseObjectId } = require("../lib/config");

class Event {
  constructor() {
    this.eventModel = EventModel;
  }

  async addNewEventData(data) {
    try {
      const new_event = new this.eventModel(data);
      const result = new_event.save();
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getAllEventsData() {
    try {
      const result = await this.eventModel
        .aggregate([
          { $match: { event_status: "ACTIVE" } },
          { $sort: { createdAt: -1 } },
        ])
        .exec();
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async editSelectedEventData(id, updated_data) {
    try {
      id = shapeIntoMongooseObjectId(id);
      const result = await this.eventModel
        .findOneAndUpdate({ _id: id }, updated_data, {
          runValidators: true,
          lean: true,
          returnDocument: "after",
        })
        .exec();
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getTargetEventsData(page, limit) {
    try {
      const result = await this.eventModel
        .aggregate([
          { $match: { event_status: "ACTIVE" } },
          { $sort: { createdAt: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
        ])
        .exec();
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = Event;
