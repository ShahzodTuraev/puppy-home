const MemberModel = require("../schema/member.model");
const ProductModel = require("../schema/product.model");
const ReviewModel = require("../schema/review.model");
const Bo_articleModel = require("../schema/bo_article.model");

class Review {
  constructor(mb_id) {
    this.reviewModel = ReviewModel;
    this.memberModel = MemberModel;
    this.productModel = ProductModel;
    this.bo_articleModel = Bo_articleModel;
    this.mb_id = mb_id;
  }

  async validateChosenTarger(review_ref_id, group_type) {
    try {
      let result;
      switch (group_type) {
        case "product":
          result = await this.productModel
            .findOne({
              _id: review_ref_id,
              product_status: "PROCESS",
            })
            .exec();
          break;
        case "community":
          result = await this.bo_articleModel
            .findOne({
              _id: review_ref_id,
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
  async insertMemberReview(review_ref_id, group_type, content, product_rating) {
    try {
      const new_review = product_rating
        ? new this.reviewModel({
            mb_id: this.mb_id,
            review_ref_id: review_ref_id,
            review_group: group_type,
            content: content,
            product_rating: product_rating,
          })
        : new this.reviewModel({
            mb_id: this.mb_id,
            review_ref_id: review_ref_id,
            review_group: group_type,
            content: content,
          });
      const result = await new_review.save();
      await this.modifyItmeViewCounts(
        review_ref_id,
        group_type,
        product_rating
      );
      return result;
    } catch (err) {
      throw err;
    }
  }

  async modifyItmeViewCounts(review_ref_id, group_type, product_rating) {
    try {
      switch (group_type) {
        case "product":
          await this.productModel
            .findByIdAndUpdate(
              {
                _id: review_ref_id,
              },
              {
                $inc: { product_reviews: 1 },
                $inc: { product_rating: product_rating },
              }
            )
            .exec();
          break;
        case "community":
          await this.bo_articleModel
            .findByIdAndUpdate(
              {
                _id: review_ref_id,
              },
              { $inc: { art_reviews: 1 } }
            )
            .exec();
          break;
      }
      return true;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Review;
