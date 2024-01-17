const MemberModel = require("../schema/member.model");
// const ProductModel = require("../schema/product.model");
const ViewModel = require("../schema/view.model");

class View {
  constructor(mb_id) {
    this.viewModel = ViewModel;
    this.memberModel = MemberModel;
    this.productModel = ProductModel;
    this.bo_articleModel = Bo_articleModel;
    this.mb_id = mb_id;
  }

  async validateChosenTarger(view_ref_id, group_type) {
    try {
      let result;
      switch (group_type) {
        case "product":
          result = await this.productModel
            .findOne({
              _id: view_ref_id,
              product_status: "PROCESS",
            })
            .exec();
          break;
        case "community":
          result = await this.bo_articleModel
            .findOne({
              _id: view_ref_id,
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
  async insertMemberView(view_ref_id, group_type) {
    try {
      const new_view = new this.viewModel({
        mb_id: this.mb_id,
        view_ref_id: view_ref_id,
        view_group: group_type,
      });
      const result = await new_view.save();
      await this.modifyItmeViewCounts(view_ref_id, group_type);
      return result;
    } catch (err) {
      throw err;
    }
  }

  //   async modifyItmeViewCounts(view_ref_id, group_type) {
  //     try {
  //       switch (group_type) {
  //         case "product":
  //           await this.productModel
  //             .findByIdAndUpdate(
  //               {
  //                 _id: view_ref_id,
  //               },
  //               { $inc: { product_views: 1 } }
  //             )
  //             .exec();
  //           break;
  //         case "community":
  //           await this.bo_articleModel
  //             .findByIdAndUpdate(
  //               {
  //                 _id: view_ref_id,
  //               },
  //               { $inc: { art_views: 1 } }
  //             )
  //             .exec();
  //           break;
  //       }
  //       return true;
  //     } catch (err) {
  //       throw err;
  //     }
  //   }

  async checkViewExistence(view_ref_id) {
    try {
      const view = await this.viewModel
        .findOne({ mb_id: this.mb_id, view_ref_id: view_ref_id })
        .exec();
      return view ? true : false;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = View;
