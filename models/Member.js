const MemberModel = require("../schema/member.model");
const bcrypt = require("bcryptjs");
const Definer = require("../lib/mistake");
const assert = require("assert");
const { shapeIntoMongooseObjectId } = require("../lib/config");

class Member {
  constructor() {
    this.memberModel = MemberModel;
  }

  async signupData(input) {
    try {
      const salt = await bcrypt.genSalt();
      input.mb_password = await bcrypt.hash(input.mb_password, salt);

      const new_member = new this.memberModel(input);
      let result;
      try {
        result = await new_member.save();
      } catch (mongo_err) {
        throw new Error(Definer.auth_err1);
      }
      result.mb_password = "";
      return result;
    } catch (err) {
      throw err;
    }
  }

  async loginData(input) {
    try {
      const member = await this.memberModel
        .findOne({ mb_nick: input.mb_nick }, { mb_nick: 1, mb_password: 1 }) //pasword shuni quymasa kelmaydi. negaki sxema modulda password kelmasin deb mantiq qushganmiz.
        .exec();
      assert.ok(member, Definer.auth_err3);

      const isMatch = await bcrypt.compare(
        input.mb_password,
        member.mb_password
      );
      assert.ok(isMatch, Definer.auth_err4);

      return await this.memberModel.findOne({ mb_nick: input.mb_nick }).exec();
    } catch (err) {
      throw err;
    }
  }

  async updateChosenMemberData(data) {
    try {
      const id = shapeIntoMongooseObjectId(data._id);
      const result = await this.memberModel
        .findOneAndUpdate({ _id: id }, data, {
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

  async getAdminControlData() {
    try {
      const result = await this.memberModel
        .find({
          mb_type: { $in: ["SHOP", "USER"] },
          mb_status: { $in: ["ONPAUSE", "ACTIVE"] },
        })
        .exec();
      assert(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getRequiredUsersData(type) {
    try {
      let result;
      switch (type) {
        case "shop":
          result = await this.memberModel
            .find({
              mb_type: "SHOP",
              mb_status: { $in: ["ONPAUSE", "ACTIVE"] },
            })
            .exec();
          break;
        case "user":
          result = await this.memberModel
            .find({
              mb_type: "USER",
              mb_status: { $in: ["ONPAUSE", "ACTIVE"] },
            })
            .exec();
          break;
      }
      assert(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Member;
