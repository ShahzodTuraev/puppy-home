const assert = require("assert");
const MemberModel = require("../schema/member.model");
const Definer = require("../lib/mistake");
const { shapeIntoMongooseObjectId } = require("../lib/config");
const Member = require("./Member");

class Shop {
  constructor() {
    this.memberModel = MemberModel;
  }
}
