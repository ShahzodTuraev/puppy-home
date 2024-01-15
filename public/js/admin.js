$(function () {
  // manipulate all users status features
  $(".mb_status_change").on("change", (e) => {
    const id = e.target.id;
    const mb_status = $(`#${id}.mb_status_change`).val();
    axios
      .post("/admin/control/edit", { _id: id, mb_status: mb_status })
      .then((response) => {
        const result = response.data;
        if (result.state === "success") alert("Successfully updated!");
        else alert(result.message);
      })
      .catch((err) => console.log(err));
  });

  $(".send_all_message").on("click", () => {
    if (window.location.href.includes("shop")) {
      $(".contact_submit").attr("id", "shop");
    } else if (window.location.href.includes("user")) {
      $(".contact_submit").attr("id", "user");
    } else {
      $(".contact_submit").attr("id", "all");
    }
    $(".contact_display").show();
  });

  $(".send_one_message").on("click", (e) => {
    const id = e.target.id;
    $(".contact_display").show();
    $(".contact_submit").attr("id", `${id}`);
  });
  $(".contact_submit").on("click", async (e) => {
    const id = e.target.id;
    const notif_receiver_id = e.target.id;
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

  //Event control scripts start

  $(".add_event_btn").on("click", () => {
    $(".add_event_display").show();
  });

  $("#add_event_submit").on("click", async () => {
    const event_subject = $("#event_subject").val(),
      event_content = $("#event_content").val(),
      event_date = $("#event_date").val(),
      event_address = $("#event_address").val();
    if (
      event_subject !== "" &&
      event_content !== "" &&
      event_date !== "" &&
      event_address !== ""
    ) {
      try {
        const response = await axios.post(`/admin/event-create`, {
          event_subject: event_subject,
          event_content: event_content,
          event_time: event_date,
          event_address: event_address,
        });
        const result = response.data;
        if (result.state == "success") {
          $("#adding_alert").show();
          alert("New event added successfully");
          location.reload();
        } else {
          alert(result.message);
        }
      } catch (err) {
        console.log("deleteProduct", err);
      }
    } else {
      $("#notif_alert_text").show();
    }
  });

  $("#event_subject").on("focus", () => {
    $("#notif_alert_text").hide();
  });
  $("#event_content").on("focus", () => {
    $("#notif_alert_text").hide();
  });
  $("#event_date").on("focus", () => {
    $("#notif_alert_text").hide();
  });
  $("#event_address").on("focus", () => {
    $("#notif_alert_text").hide();
  });

  $("#add_event_cancel").on("click", () => {
    $(".add_event_display").hide();
    $("#event_subject").val("");
    $("#event_content").val("");
    $("#event_date").val("");
    $("#event_address").val("");
  });

  $(".event_delete_button").on("click", (e) => {
    const id = e.target.id;
    $(".delete_display").show();
    $(".delete_event_confirm").attr("id", id);
  });

  $(".delete_event_confirm").on("click", async (e) => {
    try {
      const id = e.target.id;
      const response = await axios.post(`/admin/event-edit/${id}`, {
        event_status: "DELETED",
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

  $(".event_edit_button").on("click", (e) => {
    const id = e.target.id;
    $(".edit_event_display").show();
    $(".edit_event_confirm").attr("id", id);
  });

  $(".edit_event_confirm").on("click", async (e) => {
    try {
      const id = e.target.id,
        edit_subject = $("#edit_event_subject").val(),
        edit_content = $("#edit_event_content").val(),
        edit_date = $("#edit_event_date").val(),
        edit_address = $("#edit_event_address").val();
      let data = {};
      if (edit_subject !== "") data.event_subject = edit_subject;
      if (edit_content !== "") data.event_content = edit_content;
      if (edit_date !== "") data.event_date = edit_date;
      if (edit_address !== "") data.event_address = edit_address;
      const response = await axios.post(`/admin/event-edit/${id}`, data);
      const result = response.data;
      if (result.state == "success") {
        alert("This event data edited successfully");
        location.reload();
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.log("editEvent", err);
    }
  });

  $("#edit_event_cancel").on("click", () => {
    $(".edit_event_display").hide();
    $("#edit_event_subject").val("");
    $("#edit_event_content").val("");
    $("#edit_event_date").val("");
    $("#edit_event_address").val("");
  });

  //Event control scripts end
});
