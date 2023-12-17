$(function () {
  console.log($(".login_container"));
  $(".edit_comfirm_btn").on("click", async (e) => {
    const id = e.target.id;
    const name = $("#edited_product_name").attr("value");
    const new_name = $("#edited_product_name").val();
    const type = $("#edited_product_type").attr("value");
    const new_type = $("#edited_product_type").val();
    const status = $("#edited_product_status").attr("value");
    const new_status = $("#edited_product_status").val();
    const price = $("#edited_product_price").attr("value");
    const new_price = $("#edited_product_price").val();
    const left_cnt = $("#edited_product_left").attr("value");
    const new_left_cnt = $("#edited_product_left").val();
    const discount = $("#edited_product_discount").attr("value");
    const new_discount = $("#edited_product_discount").val();
    const discount_period = $("#edited_product_discount_period").attr("value");
    const new_discount_period = $("#edited_product_discount_period").val();
    const delivery = $("#edited_product_delivery_cost").attr("value");
    const new_delivery = $("#edited_product_delivery_cost").val();
    const point = $("#edited_product_point").attr("value");
    const new_point = $("#edited_product_point").val();
    const desc = $("#product_desc").attr("value");
    const new_desc = $("#product_desc").val();
    const data = {};
    if (name !== new_name && new_name !== "") data.product_name = new_name;
    if (type !== new_type) data.product_collection = new_type;
    if (status !== new_status) data.product_status = new_status;
    if (price !== new_price && new_price !== "") data.product_price = new_price;
    if (left_cnt !== new_left_cnt && new_left_cnt !== "")
      data.product_left_cnt = new_left_cnt;
    if (discount !== new_discount && new_discount !== "")
      data.product_discount = new_discount;
    if (discount_period !== new_discount_period)
      data.product_discount_period = new_discount_period;
    if (delivery !== new_delivery && new_delivery !== "")
      data.product_delivery_cost = new_delivery;
    if (point !== new_point && new_point !== "") data.product_point = new_point;
    if (desc !== new_desc && new_desc !== "")
      data.product_description = new_desc;

    if (Object.keys(data).length > 0) {
      try {
        const response = await axios.post(`/admin/products/edit/${id}`, data);
        const result = response.data;
        if (result.state == "success") {
          alert("This product's data changed successfully!");
          window.location.replace("/admin/shop-control");
        } else {
          alert(result.message);
        }
      } catch (err) {
        console.log("updateChosenproduct", err);
      }
    } else alert("Please, edit the product first!");
  });
});
