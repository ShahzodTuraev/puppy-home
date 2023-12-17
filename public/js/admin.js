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
});
