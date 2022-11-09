const carts = JSON.parse(localStorage.getItem("cart"));
const iduser = JSON.parse(localStorage.getItem("user-checkout"));
let totalCart = 0;
// get user
if (iduser) {
  $("body").prepend(`
      <div class="form-loading">
      <ul>
          <li></li>
          <li></li>
          <li></li>
      </ul>
      </div>`);
  const getdataUser = `https://getuser.vercel.app/api/getAUser/${iduser}`;
  fetch(getdataUser)
    .then((data) => data.json())
    .then((result) => {
      renderCartsUser(result);
      $("body").find(".form-loading").remove();
    })
    .catch((err) => {
      alert("Something was wrong", err);
      $("body").find(".form-loading").remove();
    });
}

renderProduct();
function renderProduct() {
  $(".products").html("");
  carts.forEach((val) => {
    $(".products").prepend(`
                            <div class="product">
                                <div class="wrapper-product">
                                    <img src=${val.img}
                                        alt="">
                                    <div class="content">
                                        <div class="name">${val.name}</div>
                                        <div class="category-quantity">
                                            <div class="category">${val.category}</div>
                                            <div class="quantity">x${val.quantity}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="product-total">$${val.total}</div>
                            </div>       
    `);
    totalCart += val.total;
  });
  $(".subtotal-detail").html(`$${totalCart}`);
}

$(document).ready(function () {
  $(".btn-submit").click(function (e) {
    e.preventDefault();
    if (iduser) {
      const name = $(".full-name").val().trim();
      const coutry = $("#coutry-region option:selected").text();
      const adress = $(".street-address").val().trim();
      const city = $(".town").val().trim();
      const phone = $(".phone-number").val().trim();
      const email = $(".user-email").val().trim();

      const d = new Date();
      const datetime =
        d.getHours() +
        ":" +
        d.getMinutes() +
        " " +
        d.getDate() +
        "-" +
        (d.getMonth() + 1) +
        "-" +
        d.getFullYear();

      if (
        name === "" ||
        adress === "" ||
        city === "" ||
        phone === "" ||
        email === ""
      ) {
        alert("Input must fill and have not special character");
      } else {
        $("body").prepend(`
              <div class="form-loading">
              <ul>
                  <li></li>
                  <li></li>
                  <li></li>
              </ul>
              </div>`);
        const addBill = {
          userid: iduser,
          name,
          coutry,
          adress,
          city,
          email,
          phone,
          carts,
          total: totalCart,
          datetime,
        };
        $.ajax({
          type: "POST",
          url: "https://getuser.vercel.app/api/addBill",
          data: JSON.stringify(addBill),
          contentType: "application/json",
          dataType: "json",
          success: function () {
            localStorage.removeItem("user-checkout");
            $.ajax({
              type: "PUT",
              url: `https://getuser.vercel.app/api/updateUser/${iduser}`,
              data: JSON.stringify({ carts: [] }),
              contentType: "application/json",
              dataType: "json",
              success: function () {
                $("body").find(".form-loading").remove();
                window.location.replace("../checkout/checkout.html");
              },
              error: function () {
                alert("Something was wrong");
                $("body").find(".form-loading").remove();
              },
            });
          },
          error: function () {
            alert("Something was wrong");
            $("body").find(".form-loading").remove();
          },
        });
      }
    } else {
      alert("You have to login");
    }
  });
});

function renderCartsUser(result) {
  $(".user-name").append(`${result.name}`).css({
    color: "#fff",
    "margin-top": "5px",
    "font-size": "14px",
  });

  $(".action-user").html(`
   <li><a class="logout" href="./register/register.html">Longout</a></li>
  `);
  $(".logout").click(function (e) {
    e.preventDefault();
    localStorage.removeItem("user");
    localStorage.removeItem("user-checkout");
    localStorage.removeItem("checkRemember");
    location.reload();
  });
}
