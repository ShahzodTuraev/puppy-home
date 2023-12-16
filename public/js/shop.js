$(function () {
  // add new product btn scripts
  $(".hiding_btn").on("click", () => {
    $(".add_product_display").show();
  });

  $("#adding_concel").on("click", () => {
    $(".add_product_display").hide();
  });

  // delete item btn scripts
  $(".delete_item").on("click", async (e) => {
    let id = e.target.id;
    try {
      const response = await axios.post(`/admin/products/edit/${id}`, {
        product_status: "DELETED",
      });
      const result = response.data;
      if (result.state == "success") {
        confirm("Do you want to delete the item?");
        location.reload();
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.log("deleteProduct", err);
    }
  });

  // member edit scripts start
  $("#mb_edit_concel").on("click", () => {
    $(".profile_edit_display").hide();
  });

  $("#edit_mb_btn").on("click", () => {
    $(".profile_edit_display").show();
  });

  $(".mb_edit_comfirm").on("click", async (e) => {
    const id = e.target.id;
    const name = $("#mb_nick").attr("value");
    const new_name = $("#mb_nick").val();
    const full_name = $("#mb_full_name").attr("value");
    const new_full_name = $("#mb_full_name").val();
    const phone = $("#mb_phone").attr("value");
    const new_phone = $("#mb_phone").val();
    const address = $("#mb_address").attr("value");
    const new_address = $("#mb_address").val();
    const description = $("#mb_description").attr("value");
    const new_description = $("#mb_description").val();

    let data = { _id: id };
    if (name !== new_name && new_name !== "") data.mb_nick = new_name;
    if (full_name !== new_full_name) data.mb_full_name = new_full_name;
    if (phone !== new_phone && new_phone !== "") data.mb_phone = new_phone;
    if (address !== new_address) data.mb_address = new_address;
    if (description !== new_description) data.mb_description = new_description;
    if (Object.keys(data).length > 1) {
      try {
        const response = await axios.post(`/admin/member/edit/${id}`, data);
        const result = response.data;
        if (result.state == "success") {
          alert("This member's data changed successfully!");
          window.location.replace("/admin/logout");
        } else {
          alert(result.message);
        }
      } catch (err) {
        console.log("updateMember", err);
      }
    } else alert("Please, edit the product first!");
  });

  // member edit scripts end
});
// add new product form related scripts start
function validateForm() {
  const product_name = $("#product_name").val(),
    product_price = $("#product_price").val(),
    product_left_cnt = $("#product_left_cnt").val(),
    product_description = $("#product_desc").val(),
    product_delivery_cost = $("#product_delivery_cost").val();

  if (
    product_name == "" ||
    product_price == "" ||
    product_left_cnt == "" ||
    product_description == "" ||
    product_delivery_cost == ""
  ) {
    alert("Please, fill out required field !");

    return false;
  } else return true;
}

function previewFileHandler(input, order) {
  const image_class_name = input.className;
  const file = $(`.${image_class_name}`).get(0).files[0],
    fileType = file["type"],
    validImageTypes = ["image/jpg", "image/jpeg", "image/png"];

  if (!validImageTypes.includes(fileType)) {
    alert("Please upload only allowed formats (jpg, jpeg, png)");
  } else {
    let reader = new FileReader();
    reader.onload = function () {
      $(`#image_section_${order}`).attr("src", reader.result);
    };
    reader.readAsDataURL(file);
  }
}
// add new product form related scripts end

// edit member profile form related scripts start
function previewImgUpdate(input) {
  const img_class_name = input.className;
  const file = $(`.${img_class_name}`).get(0).files[0];
  (fileType = file["type"]),
    (validImageTypes = ["image/jpg", "image/jpeg", "image/png"]);
  if (!validImageTypes.includes(fileType)) {
    alert("Please upload only allowed formats (jpg, jpeg, png)");
  } else {
    let reader = new FileReader();
    reader.onload = function () {
      $(".edit_user_img").attr("src", reader.result);
    };
    reader.readAsDataURL(file);
  }
}
// edit member profile form related scripts end
