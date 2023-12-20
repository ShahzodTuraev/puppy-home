$(function () {
  // add new product btn scripts
  $(".hiding_btn").on("click", () => {
    $(".add_product_display").show();
  });

  $("#adding_concel").on("click", () => {
    $(".add_product_display").hide();
  });

  // delete item btn scripts
  $(".delete_item").on("click", (e) => {
    let id = e.target.id;
    $(".delete_item_confirm").attr("id", `${id}`);
    $(".delete_display").show();
  });

  $(".delete_item_confirm").on("click", async (e) => {
    let id = e.target.id;
    // $(".delete_display").hide();
    try {
      const response = await axios.post(`/admin/products/edit/${id}`, {
        product_status: "DELETED",
      });
      const result = response.data;
      if (result.state == "success") {
        $("#delete_alert").show();
        location.reload();
        setTimeout(() => {
          $(".delete_display").hide();
          $("#delete_alert").hide();
        }, 800);
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.log("deleteProduct", err);
    }
  });

  $("#delete_box_close").on("click", () => {
    $(".delete_display").hide();
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
    const email = $("#mb_email").attr("value");
    const new_email = $("#mb_email").val();
    let data = { _id: id };
    if (name !== new_name && new_name !== "") data.mb_nick = new_name;
    if (full_name !== new_full_name) data.mb_full_name = new_full_name;
    if (phone !== new_phone && new_phone !== "") data.mb_phone = new_phone;
    if (email !== new_email && new_email !== "") data.mb_email = new_email;
    if (address !== new_address) data.mb_address = new_address;
    if (description !== new_description) data.mb_description = new_description;

    if (Object.keys(data).length > 1) {
      try {
        const response = await axios.post(`/admin/member/edit/${id}`, data);
        const result = response.data;
        if (result.state == "success") {
          alert(
            "This member's data changed successfully. In order to use the account, login with updated user data again!"
          );
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

  // contact admin scripts start
  $("#contact_admin").on("click", () => {
    $(".contact_display").show();
  });

  $("#contact_cancel").on("click", () => {
    $(".contact_display").hide();
    $("#notif_subject").val("");
    $("#notif_content").val("");
  });
  $("#contact_submit").on("click", async () => {
    const notif_receiver_id = "admin";
    const notif_subject = $("#notif_subject").val();
    const notif_content = $("#notif_content").val();
    const contact_data = {
      notif_subject: notif_subject,
      notif_content: notif_content,
      notif_receiver_id: notif_receiver_id,
    };
    if (notif_content !== "" && notif_subject !== "") {
      try {
        const response = await axios.post(
          `/admin/notification/send`,
          contact_data
        );
        const result = response.data;
        if (result.state == "success") {
          $(".contact_display").hide();
          $("#notif_subject").val("");
          $("#notif_content").val("");
          $("#contact_alert").show();
          setTimeout(() => {
            $("#contact_alert").fadeOut();
          }, 1800);
        } else {
          alert(result.message);
        }
      } catch (err) {
        console.log("contactAdmin", err);
      }
    } else {
      $("#notif_alert_text").show();
    }
  });
  $("#notif_subject").on("focus", () => {
    $("#notif_alert_text").hide();
  });
  $("#notif_content").on("focus", () => {
    $("#notif_alert_text").hide();
  });

  // contact admin scripts end

  // show messages scripts start

  $(".show_message").on("click", async () => {
    $(".notification_dropdown").slideToggle();
  });

  $(".delete_one_message").on("click", async (e) => {
    try {
      const id = e.target.id;
      let message_count = $(".message_count_num").text() * 1;
      $(".message_count_num").text(message_count - 1);
      $(`#${id}`).parentsUntil(".notification_messages_wrap").hide();
      const response = await axios.post(`/admin/notification/receive`, {
        id: id,
      });
      const result = response.data;
      if (result.state !== "success") alert(result.message);
    } catch (err) {
      console.log("deleteNotification", err);
    }
  });

  $("#delete_all_message").on("click", async () => {
    try {
      const response = await axios.post(`/admin/notification/receive`, {
        id: "all",
      });
      const result = response.data;
      if (result.state == "success") {
        $(".message_count_num").text("0");
        $(".message_container").hide();
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.log("deleteNotification", err);
    }
  });

  // show messages scripts end
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
