const ProductModel = require("../schema/product.model");
const Definer = require("../lib/mistake");
const assert = require("assert");
const { shapeIntoMongooseObjectId } = require("../lib/config");

class Product {
  constructor() {
    this.productModel = ProductModel;
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
