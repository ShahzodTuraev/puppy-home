const BoArticleModel = require("../schema/bo_article.model");
const {
  shapeIntoMongooseObjectId,
  lookup_auth_member_liked,
} = require("../lib/config");
const Definer = require("../lib/mistake");
const assert = require("assert");
const Member = require("./Member");
class Community {
  constructor() {
    this.boArticleModel = BoArticleModel;
  }

  async createArticleData(member, data) {
    try {
      data.mb_id = shapeIntoMongooseObjectId(member._id);
      const new_article = await this.saveArticleData(data);
      return new_article;
    } catch (err) {
      throw err;
    }
  }
  async saveArticleData(data) {
    try {
      const article = new this.boArticleModel(data);
      return await article.save();
    } catch (mongo_err) {
      console.log(mongo_err);
      throw new Error(Definer.mongo_validation_err1);
    }
  }

  async getMemberArticlesData(member, mb_id, inquery) {
    try {
      mb_id = shapeIntoMongooseObjectId(mb_id);
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id),
        page = inquery["page"] ? inquery["page"] * 1 : 1,
        limit = inquery["limit"] ? inquery["limit"] * 1 : 5;
      const result = await this.boArticleModel
        .aggregate([
          { $match: { mb_id: mb_id, art_status: "active" } },
          { $sort: { createdAt: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $lookup: {
              from: "members",
              localField: "mb_id",
              foreignField: "_id",
              as: "member_data",
            },
          },
          { $unwind: "$member_data" },
          lookup_auth_member_liked(auth_mb_id),
        ])
        .exec();
      assert.ok(result, Definer.article_err2);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getArticlesData(member, inquery) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      let matches = { art_status: "active" };

      inquery.limit *= 1;
      inquery.page *= 1;
      const sort = { createdAt: -1 };
      const result = await this.boArticleModel
        .aggregate([
          { $match: matches },
          { $sort: sort },
          { $skip: (inquery.page - 1) * inquery.limit },
          { $limit: inquery.limit },
          {
            $lookup: {
              from: "members",
              localField: "mb_id",
              foreignField: "_id",
              as: "member_data",
            },
          },
          { $unwind: "$member_data" },
          lookup_auth_member_liked(auth_mb_id),
        ])
        .exec();
      assert.ok(result, Definer.article_err3);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getChosenArtData(member, art_id) {
    try {
      art_id = shapeIntoMongooseObjectId(art_id);
      if (member) {
        const member_obj = new Member();
        await member_obj.viewChosenItemByMember(member, art_id, "community");
      }
      const result = await this.boArticleModel.findById({ _id: art_id }).exec();
      assert.ok(result, Definer.article_err3);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Community;
