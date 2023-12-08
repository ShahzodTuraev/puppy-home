const assert = require("assert");
const Definer = require("../lib/mistake");
const Product = require("../models/Product");
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
    console.log(req.files);
    data.product_images = req.files.map((ele) => {
      return ele.path.replace(/\\/g, "/");
    });

    const result = await product.addNewProductData(data, req.member);
    const html = `<script>
                    alert("new product ${data.product_name} added successfully");
                    window.location.replace('/admin/admin-control');
                  </script>`;
    res.end(html);
  } catch (err) {
    console.log(`ERROR, cont/addNewProduct, ${err.message} `);
  }
};
