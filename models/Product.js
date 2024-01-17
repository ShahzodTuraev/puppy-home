const ProductModel = require("../schema/product.model");
const Definer = require("../lib/mistake");
const assert = require("assert");
const { shapeIntoMongooseObjectId } = require("../lib/config");

class Product {
  constructor() {
    this.productModel = ProductModel;
  }

  async getAllProductsData(member, data) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      const match = {
        product_status: "PROCESS",
        product_collection: {
          $in: data.product_collection,
        },
        $or: [
          {
            product_price: { $gt: data.min_price * 1, $lt: data.max_price * 1 },
          },
        ],
      };

      const sort = {
        createdAt: -1,
      };
      data.order.sale ? (sort.product_discount = -1) : sort;
      data.order.view ? (sort.product_views = -1) : sort;
      data.order.review ? (sort.product_review = -1) : sort;
      data.order.points ? (sort.product_point = -1) : sort;
      const result = await this.productModel
        .aggregate([
          { $match: match },
          { $sort: sort },
          { $skip: (data.page * 1 - 1) * data.limit },
          { $limit: data.limit * 1 },
          {
            $lookup: {
              from: "members",
              localField: "shop_mb_id",
              foreignField: "_id",
              as: "shop_data",
            },
          },
          { $unwind: "$shop_data" },
        ])
        .exec();
      // check auth user product likes
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getAllProductsDataShop(member) {
    try {
      member._id = shapeIntoMongooseObjectId(member._id);
      const result = await this.productModel.aggregate([
        {
          $match: {
            shop_mb_id: member._id,
            product_status: { $in: ["PAUSED", "PROCESS"] },
          },
        },
      ]);
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async addNewProductData(data, member) {
    try {
      data.shop_mb_id = shapeIntoMongooseObjectId(member._id);
      const new_product = new this.productModel(data);
      const result = await new_product.save();
      assert.ok(result, Definer.product_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getUpdateChosenProductData(mb_id, id) {
    try {
      id = shapeIntoMongooseObjectId(id);

      const result = await this.productModel
        .findById({ _id: id, shop_mb_id: mb_id })
        .exec();
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async updateChosenProductData(id, updated_data, mb_id) {
    try {
      id = shapeIntoMongooseObjectId(id);
      mb_id = shapeIntoMongooseObjectId(mb_id);
      const result = await this.productModel
        .findOneAndUpdate({ _id: id, shop_mb_id: mb_id }, updated_data, {
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
}

module.exports = Product;
