const assert = require("assert");
const Definer = require("../lib/mistake");
const Product = require("../models/Product");
const Notification = require("../models/Notification");
let productController = module.exports;

productController.getAllProducts = async (req, res) => {
  try {
    console.log("POST: cont/getAllProducts");
    const product = new Product();
    const result = await product.getAllProductsData(req.member, req.body);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getAllProducts, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

productController.getChosenProduct = async (req, res) => {
  try {
    console.log("GET: cont/getChosenProduct");
    const product = new Product(),
      id = req.params.id,
      result = await product.getChosenProductData(req.member, id);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getChosenProduct, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

productController.getAllServices = async (req, res) => {
  try {
    console.log("POST: cont/getAllServices");
    const product = new Product();
    const result = await product.getAllServicesData(req.member, req.body);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getAllServices, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

productController.searchProduct = async (req, res) => {
  try {
    console.log("GET: cont/searchProduct");
    const query = req.query.text;
    const product = new Product();
    const result = await product.searchProductData(query);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/searchProduct, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};
/**************************************
 *      BSSR RELATED METHODS          *
 *************************************/

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
