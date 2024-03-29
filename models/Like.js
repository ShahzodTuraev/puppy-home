const ProductModel = require("../schema/product.model");
const LikeModel = require("../schema/like.model");
const Bo_articleModel = require("../schema/bo_article.model");
const Definer = require("../lib/mistake");
const { lookup_auth_member_liked } = require("../lib/config");

class Like {
  constructor(mb_id) {
    this.likeModel = LikeModel;
    this.productModel = ProductModel;
    this.bo_articleModel = Bo_articleModel;
    this.mb_id = mb_id;
  }

  async validateChosenTargetItem(id, group_type) {
    try {
      let result;
      switch (group_type) {
        case "product":
          result = await this.productModel
            .findOne({
              _id: id,
              product_status: "PROCESS",
            })
            .exec();
          break;
        case "service":
          result = await this.productModel
            .findOne({
              _id: id,
              product_status: "PROCESS",
            })
            .exec();
          break;
        case "community":
        default:
          result = await this.bo_articleModel
            .findOne({
              _id: id,
              art_status: "active",
            })
            .exec();
          break;
      }
      return !!result;
    } catch (err) {
      throw err;
    }
  }
  async checkLikeExistence(like_ref_id) {
    try {
      const like = await this.likeModel
        .findOne({
          mb_id: this.mb_id,
          like_ref_id: like_ref_id,
        })
        .exec();
      return !!like;
    } catch (err) {
      throw err;
    }
  }

  async removeMemberLike(like_ref_id, group_type) {
    try {
      const result = await this.likeModel
        .findOneAndDelete({
          like_ref_id: like_ref_id,
          mb_id: this.mb_id,
        })
        .exec();
      await this.modifyItemLikeCounts(like_ref_id, group_type, -1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async insertMemberLike(like_ref_id, group_type) {
    try {
      const new_like = new this.likeModel({
        mb_id: this.mb_id,
        like_ref_id: like_ref_id,
        like_group: group_type,
      });
      const result = await new_like.save();
      await this.modifyItemLikeCounts(like_ref_id, group_type, 1);
      return result;
    } catch (err) {
      console.log(err);
      throw new Error(Definer.mongo_validation_err1);
    }
  }

  async modifyItemLikeCounts(like_ref_id, group_type, modifier) {
    try {
      switch (group_type) {
        case "product":
          await this.productModel
            .findByIdAndUpdate(
              {
                _id: like_ref_id,
              },
              { $inc: { product_likes: modifier } }
            )
            .exec();
          break;
        case "service":
          await this.productModel
            .findByIdAndUpdate(
              {
                _id: like_ref_id,
              },
              { $inc: { product_likes: modifier } }
            )
            .exec();
          break;
        case "community":
        default:
          await this.bo_articleModel
            .findByIdAndUpdate(
              {
                _id: like_ref_id,
              },
              { $inc: { art_likes: modifier } }
            )
            .exec();
          break;
      }
      return true;
    } catch (err) {
      throw err;
    }
  }

  async myLikesData(mb_id, data) {
    try {
      const match = {
        mb_id: mb_id,
        like_group: data.like_group,
      };
      const result = await this.likeModel
        .aggregate([
          { $match: match },
          { $sort: { createdAt: -1 } },
          { $skip: (data.page * 1 - 1) * data.limit },
          { $limit: data.limit * 1 },
          {
            $lookup: {
              from: "products",
              localField: "like_ref_id",
              foreignField: "_id",
              pipeline: [lookup_auth_member_liked(mb_id)],
              as: "product_data",
            },
          },
          { $unwind: "$product_data" },
        ])
        .exec();
      return result;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = Like;
