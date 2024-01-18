const MemberModel = require("../schema/member.model");
const Review = require("./Review");
const bcrypt = require("bcryptjs");
const Definer = require("../lib/mistake");
const View = require("./View");
const Like = require("./Like");
const assert = require("assert");
const {
  shapeIntoMongooseObjectId,
  lookup_auth_member_following,
} = require("../lib/config");

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

  async getChosenMemberData(member, id) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      id = shapeIntoMongooseObjectId(id);
      let aggregationQuery = [
        { $match: { _id: id, mb_status: "ACTIVE" } },
        { $unset: "mb_password" },
      ];
      if (member) {
        // await this.viewChosenItemByMember(member, id, "member");
        aggregationQuery.push(
          lookup_auth_member_following(auth_mb_id, "members")
        );
      }

      const result = await this.memberModel.aggregate(aggregationQuery).exec();

      assert.ok(result, Definer.general_err2);
      return result[0];
    } catch (err) {
      throw err;
    }
  }

  async viewChosenItemByMember(member, view_ref_id, group_type) {
    try {
      view_ref_id = shapeIntoMongooseObjectId(view_ref_id);
      const mb_id = shapeIntoMongooseObjectId(member._id);
      const view = new View(mb_id);
      const isValid = await view.validateChosenTarger(view_ref_id, group_type);
      assert.ok(isValid, Definer.general_err2);

      const doesExist = await view.checkViewExistence(view_ref_id);

      if (!doesExist) {
        const result = await view.insertMemberView(view_ref_id, group_type);
        assert.ok(result, Definer.general_err1);
      }
      return true;
    } catch (err) {
      throw err;
    }
  }

  async likeChosenItemByMember(member, like_ref_id, group_type) {
    const mb_id = shapeIntoMongooseObjectId(member._id);
    like_ref_id = shapeIntoMongooseObjectId(like_ref_id);

    const like = new Like(mb_id);
    const isValid = await like.validateChosenTargetItem(
      like_ref_id,
      group_type
    );
    assert.ok(isValid, Definer.general_err2);
    // doesExist
    const doesExist = await like.checkLikeExistence(like_ref_id);
    let data = doesExist
      ? await like.removeMemberLike(like_ref_id, group_type)
      : await like.insertMemberLike(like_ref_id, group_type);
    assert.ok(data, Definer.general_err1);
    const result = {
      like_group: data.like_group,
      like_ref_id: data.like_ref_id,
      like_status: doesExist ? 0 : 1,
    };
    return result;
  }

  async createReviewData(member, data) {
    try {
      const review_ref_id = shapeIntoMongooseObjectId(data.review_ref_id);
      const mb_id = shapeIntoMongooseObjectId(member._id);
      const review = new Review(mb_id);
      const group_type = data.group_type;
      const content = data.content;
      const isValid = await review.validateChosenTarger(
        review_ref_id,
        group_type
      );
      assert.ok(isValid, Definer.general_err2);

      const result = await review.insertMemberReview(
        review_ref_id,
        group_type,
        content
      );
      assert.ok(result, Definer.general_err1);

      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Member;
