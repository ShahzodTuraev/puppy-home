const assert = require("assert");
const Definer = require("../lib/mistake");
const Product = require("../models/Product");
const Notification = require("../models/Notification");
let productController = module.exports;

/**************************************
 *      BSSR RELATED METHODS          *
 *************************************/
productController.getAllProducts = async (req, res) => {
  try {
    console.log("POST: cont/getAllProducts");

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getAllProducts, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

productController.addNewProduct = async (req, res) => {
  try {
    console.log("POST: cont/addNewProduct");
    assert(req.files, Definer.general_err3);
    const product = new Product();
    let data = req.body;
    data.product_images = req.files.map((ele) => {
      return ele.path.replace(/\\/g, "/");
    });

    const result = await product.addNewProductData(data, req.member);
    const html = `<script>
                    alert("new product ${data.product_name} added successfully");
                    window.location.replace('/admin/shop-control');
                  </script>`;
    res.end(html);
  } catch (err) {
    console.log(`ERROR, cont/addNewProduct, ${err.message} `);
  }
};

productController.updateChosenProduct = async (req, res) => {
  try {
    console.log("POST: cont/updateChosenProduct");
    const product = new Product(),
      id = req.params.id,
      mb_id = req.member._id;
    result = await product.updateChosenProductData(id, req.body, mb_id);
    await res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/updateChosenProduct, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

productController.getUpdateChosenProduct = async (req, res) => {
  try {
    console.log("POST: cont/getUpdateChosenProduct");
    const product = new Product(),
      id = req.params.id,
      data = await product.getUpdateChosenProductData(req.member.id, id);
    res.render("product-page", { product_data: data });
  } catch (err) {
    console.log(`ERROR, cont/getUpdateChosenProduct, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

productController.getMyStatistics = async (req, res) => {
  try {
    console.log("GET: cont/getMyStatistics");
    const product = new Product(),
      product_data = await product.getAllProductsDataShop(req.member),
      notification = new Notification(),
      receiver_id = req.member._id,
      notification_data = await notification.receiveNotificationData(
        receiver_id
      ),
      data = [product_data, notification_data];
    res.render("statistics-page", { statistics: data });
  } catch (err) {
    console.log(`ERROR, cont/getMyStatistics, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};
