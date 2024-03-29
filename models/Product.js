const ProductModel = require("../schema/product.model");
const Definer = require("../lib/mistake");
const assert = require("assert");
const {
  shapeIntoMongooseObjectId,
  lookup_auth_member_liked,
} = require("../lib/config");
const Member = require("./Member");

class Product {
  constructor() {
    this.productModel = ProductModel;
  }

  async getAllProductsData(member, data) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      const min_price = data.price[0] * 1000;
      const max_price = data.price[1] * 1000;
      const match =
        data.search !== ""
          ? {
              product_status: "PROCESS",
              product_collection: {
                $in: data.product_collection,
              },
              $or: [
                {
                  product_price: {
                    $gt: min_price,
                    $lt: max_price,
                  },
                },
              ],
              product_name: {
                $regex: ".*" + data.search + ".*",
                $options: "i",
              },
            }
          : {
              product_status: "PROCESS",
              product_collection: {
                $in: data.product_collection,
              },
              $or: [
                {
                  product_price: {
                    $gt: min_price,
                    $lt: max_price,
                  },
                },
              ],
            };

      const sort =
        data.order === "product_price"
          ? { [data.order]: 1 }
          : { [data.order]: -1 };
      const result = await this.productModel
        .aggregate([
          { $match: match },
          { $sort: sort },
          { $skip: (data.page * 1 - 1) * data.limit },
          { $limit: data.limit * 1 },
          lookup_auth_member_liked(auth_mb_id),
        ])
        .exec();

      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getChosenProductData(member, id) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      id = shapeIntoMongooseObjectId(id);
      if (member) {
        const member_obj = new Member();
        await member_obj.viewChosenItemByMember(member, id, "product");
      }
      const result = await this.productModel
        .aggregate([
          { $match: { _id: id, product_status: "PROCESS" } },
          {
            $lookup: {
              from: "members",
              localField: "shop_mb_id",
              foreignField: "_id",
              as: "shop_data",
            },
          },
          { $unwind: "$shop_data" },
          lookup_auth_member_liked(auth_mb_id),
        ])
        .exec();
      assert.ok(result, Definer.general_err1);
      return result[0];
    } catch (err) {
      throw err;
    }
  }

  async getAllServicesData(member, data) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      const match = {
        product_status: "PROCESS",
        product_collection: "service",
        product_name: { $in: data.service_collection },
        product_description: { $in: data.service_area },
      };

      const sort = { [data.order]: -1 };
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
              as: "member_data",
            },
          },
          { $unwind: "$member_data" },
          lookup_auth_member_liked(auth_mb_id),
        ])
        .exec();
      //todo: check auth user product likes
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async searchProductData(query) {
    try {
      await this.productModel.createIndexes({ product_name: "text" });
      const result = await this.productModel.find({
        $text: { $search: "protein" },
      });

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
