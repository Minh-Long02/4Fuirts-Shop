var ProductsDB;

// #### MENU ####
$("body").prepend(`
            <div class="form-loading">
                <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
        `);
const checkAdmin = JSON.parse(localStorage.getItem("admin"));
if (checkAdmin) {
  $("body").prepend(`
            <div class="form-loading">
                <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
        `);
  localStorage.removeItem("admin");
  fetch(`https://getuser.vercel.app/api/getAAdmin/${checkAdmin}`)
    .then((data) => data.json())
    .then((result) => {
      $("body").find(".form-loading").remove();
      handleAdmin(result);
      handleAdminProducts();
    });
} else {
  window.location.replace("./loginadmin/loginadmin.html");
}

function handleAdmin(result) {
  $(".user-name").append(`${result.name}`).css({
    color: "#fafafa",
    "font-size": "14px",
    "margin-top": "5px",
  });

  if (result.permission) {
    $(".action-dropdown-add").html(`
            <li><a class="add-new-product" href="#">Add new product</a></li>
            <li><a class="add-new-admin" href="#">Add new admin</a></li>
        `);
  } else {
    $(".action-dropdown-add").html(
      `<li><a class="add-new-product" href="#">Add new product</a></li>`
    );
  }

  $(".add-new-admin").click(function (e) {
    $(".handle-register").addClass("show-register");
  });
}

function handleAdminProducts() {
  const menus = document.querySelectorAll("#menu");
  menus.forEach((menu) => {
    $(menu).click((e) => {
      SetMenuActive(menu);
      RenderCards(ProductsDB, $(menu).data().category);
    });
  });

  // Add class active when click to the menu:
  SetMenuActive = (menuActive) => {
    menus.forEach((menu) => {
      $(menu).removeClass("active");
    });
    $(menuActive).addClass("active");
  };

  // #### PRODUCTS ####

  // Set data for ProductsDB:
  SetProductsDB = (DB) => {
    ProductsDB = DB;
  };

  $(".btn-apply").click(function (e) {
    e.preventDefault();
    if (checkAdmin) {
      const getEmail = $(".input-email").val().trim();
      const getUsername = $(".input-username").val().trim();
      const getUserPassword = $(".input-password").val().trim();
      if (getEmail === "" || getUsername === "" || getUserPassword === "") {
        alert("Input can not be empty");
      } else if (tesEmail(getEmail)) {
        alert("Invalid email");
      } else if (testing(getUsername)) {
        alert("Username must not have spaces or special characters");
      } else if (getUsername.length > 25) {
        alert("Username must be less than 25 characters");
      } else if (getUsername.length < 4) {
        alert("Username must be at least 4 characters");
      } else {
        $("body").prepend(`
                <div class="form-loading">
                  <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                  </ul>
                </div>`);
        fetch("https://getuser.vercel.app/api/getAllAdmin")
          .then((data) => data.json())
          .then((result) => {
            const checkNameUser = result.findIndex(
              (val) => val.name === getUsername && val._id !== checkAdmin
            );
            const checkEmailUser = result.findIndex(
              (val) => val.email === getEmail && val._id !== checkAdmin
            );
            const findPassword = result.findIndex(
              (val) =>
                val._id === checkAdmin && val.password === getUserPassword
            );
            if (findPassword === -1) {
              $("body").find(".form-loading").remove();
              alert("Incorrect password!");
            } else if (checkEmailUser !== -1) {
              $("body").find(".form-loading").remove();
              alert("Email already exists");
            } else if (checkNameUser !== -1) {
              $("body").find(".form-loading").remove();
              alert("Username already exists");
            } else if (
              findPassword !== -1 &&
              checkEmailUser === -1 &&
              checkNameUser === -1
            ) {
              const updateUser = {
                email: getEmail,
                name: getUsername,
              };

              $.ajax({
                type: "PUT",
                url: `https://getuser.vercel.app/api/updateAdmin/${checkAdmin}`,
                data: JSON.stringify(updateUser),
                contentType: "application/json",
                dataType: "json",
                success: function () {
                  alert("changed success");
                  location.reload();
                },
                error: function () {
                  alert("Update was wrong");
                  $("body").find(".form-loading").remove();
                },
              });
            }
          })
          .catch((err) => {
            alert("Something was wrong", err);
            $("body").find(".form-loading").remove();
          });
      }
    } else {
      alert("You don't have permissison to apply");
    }
  });

  // handle profile admin
  $(document).ready(function () {
    $(".Profile-admin").click(function (e) {
      e.preventDefault();
      localStorage.setItem("admin", JSON.stringify(checkAdmin));
      $("body").prepend(`
      <div class="form-loading">
      <ul>
      <li></li>
      <li></li>
      <li></li>
      </ul>
      </div>`);
      fetch(`https://getuser.vercel.app/api/getAAdmin/${checkAdmin}`)
        .then((data) => data.json())
        .then((result) => {
          $("body").find(".form-loading").remove();
          $(".input-email").val(result.email);
          $(".input-username").val(result.name);
          $(".handle-profile").css({
            opacity: 1,
            visibility: "visible",
          });
        })
        .catch((err) => {
          alert("Something was wrong", err);
          $("body").find(".form-loading").remove();
        });
    });
  });

  $(".btn-changed-password").click(function (e) {
    e.preventDefault();

    if (checkAdmin) {
      const oldPassword = $(".old-pass").val().trim();
      const newPassword = $(".new-pass").val().trim();
      const comfirmPassword = $(".comfirm-pass").val().trim();
      if (testing(newPassword) || testing(comfirmPassword)) {
        alert("Password must not have spaces or special characters");
      } else if (newPassword === "" || comfirmPassword === "") {
        alert("Invalid value");
      } else if (comfirmPassword !== newPassword) {
        alert("The Password is different from the Confirm!");
      } else if (comfirmPassword.length > 30) {
        alert("Password must be less than 30 haracters");
      } else if (comfirmPassword.length < 4) {
        alert("Password must be at least 4 characters");
      } else {
        $("body").prepend(`
                <div class="form-loading">
                  <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                  </ul>
                </div>`);
        fetch(`https://getuser.vercel.app/api/getAAdmin/${checkAdmin}`)
          .then((data) => data.json())
          .then((result) => {
            if (result.password !== oldPassword) {
              $("body").find(".form-loading").remove();
              alert("Incorrect password!");
            } else {
              $.ajax({
                type: "PUT",
                url: `https://getuser.vercel.app/api/updateAdmin/${checkAdmin}`,
                data: JSON.stringify({ password: comfirmPassword }),
                contentType: "application/json",
                dataType: "json",
                success: function () {
                  alert("changed success");
                  $("body").find(".form-loading").remove();
                  location.reload();
                },
                error: function () {
                  alert("Something was wrong");
                  $("body").find(".form-loading").remove();
                },
              });
            }
          });
      }
    } else {
      alert("You don't have permissison to apply");
    }
  });

  // Render cards from database:
  RenderCards = (data, category) => {
    var base = ``;
    if (category != "all") {
      data.map((val) => {
        if (val.category == category) {
          base =
            base +
            `
                    <div class="card">
                        <div class="card-content">
                            <div class="img">
                                <div class="details">
                                    <span id="nameAndPrice">${val.name}<br>$${val.price}</span>
                                </div>
                                <img src=${val.image} alt="">
                            </div>
                            <div class="group-button">
                                <button id="buttonEdit" data-id="${val._id}">Edit</button>
                                <button id="buttonDelete" data-id="${val._id}">Delete</button>
                            </div>
                        </div>
                    </div>
                `;
        }
      });
    } else if (category == "all") {
      data.map((val) => {
        base =
          base +
          `
                <div class="card">
                    <div class="card-content">
                        <div class="img">
                            <div class="details">
                                <span id="nameAndPrice">${val.name}<br>$${val.price}</span>
                            </div>
                            <img src=${val.image} alt="">
                        </div>
                        <div class="group-button">
                            <button id="buttonEdit" data-id="${val._id}">Edit</button>
                            <button id="buttonDelete" data-id="${val._id}">Delete</button>
                        </div>
                    </div>
                </div>
            `;
      });
    }
    $(".cards").html(base);
    SetBtnEvent();
  };

  // Set event for btnEdit & btnDelete:
  SetBtnEvent = () => {
    // Button Edit:
    const btnEdits = document.querySelectorAll("#buttonEdit");
    btnEdits.forEach((btn) => {
      $(btn).click((e) => {
        e.preventDefault();
        const data = GetDataFromId($(btn).data().id);
        $(".admin-input").html(`
                <div class="box-edit">
                    <div class="left-content">
                        <span id="title">Edit Product</span>
                        <form action="">
                            <div class="group-input">
                                <label for="name">Name:</label>
                                <input type="text" name="" id="name">
                            </div>
                            <div class="group-input">
                                <label for="price">Price:</label>
                                <input type="text" name="" id="price">
                            </div>
                            <div class="group-input">
                                <label for="url">Image URL:</label>
                                <input type="text" name="" id="url">
                            </div>
                            <div class="group-input">
                                <label for="name">Category:</label>
                                <select name="" id="categories">
                                    <option value="vegetables">vegetables</option>
                                    <option value="fruit">fruit</option>
                                    <option value="dried">dried</option>
                                    <option value="frozen">frozen</option>
                                    <option value="organic">organic</option>
                                </select>
                            </div>
                        </form>
                        <div class="group-button">
                            <button id="btnCancel">Cancel</button>
                            <button id="btnApply">Apply</button>
                        </div>
                    </div>
                    <div class="right-content">
                        <div class="card">
                            <div class="card-content">
                                <div class="img">
                                    <div class="details">
                                        <span id="nameAndPrice">${data.name}<br>$${data.price}<br>${data.category}</span>
                                    </div>
                                    <img src=${data.image} alt="">
                                </div>
                            </div>
                        </div>
                        <button id="btnComplete" data-name="${data.name}" data-price="${data.price}" data-url="${data.image}" data-category="${data.category}">Complete</button>
                    </div>
                </div>
            `);
        $("#name").val(data.name);
        $("#price").val(data.price);
        $("#url").val(data.image);

        document.querySelector("#categories").value = data.category;
        $("#btnCancel").click((e) => {
          $(".admin-input").fadeOut(400);
        });

        $("#btnApply").click((e) => {
          $(".right-content").html(`
                    <div class="card">
                        <div class="card-content">
                            <div class="img">
                                <div class="details">
                                    <span id="nameAndPrice">${$(
                                      "#name"
                                    ).val()}<br>$${$("#price").val()}<br>${$(
            "#categories option:selected"
          ).text()}</span>
                                </div>
                                <img src=${$("#url").val()} alt="undefined!!!">
                            </div>
                        </div>
                    </div>
                    <button id="btnComplete" data-name="${$(
                      "#name"
                    ).val()}" data-price="${$("#price").val()}" data-url="${$(
            "#url"
          ).val()}" data-category="${$(
            "#categories option:selected"
          ).text()}">Complete</button>
                `);
          $("#btnComplete").click((e) => {
            $(".admin-input").fadeOut(400);
            const idComplete = $(btn).data().id;
            const newProduct = {
              name: $("#btnComplete").data().name,
              price: $("#btnComplete").data().price,
              img: $("#btnComplete").data().url,
              category: $("#btnComplete").data().category,
            };
            $.ajax({
              type: "PUT",
              url: `https://getuser.vercel.app/api/updateProduct/${idComplete}`,
              data: JSON.stringify(newProduct),
              contentType: "application/json",
              dataType: "json",
              success: function (response) {
                GetProductsFromAPI();
                fetch("https://getuser.vercel.app/api/getAllUser")
                  .then((data) => data.json())
                  .then((result) => {
                    result.forEach((val) => {
                      val.carts.forEach((valCart) => {
                        if (idComplete === valCart.id) {
                          const cartUser = {
                            carts: val.carts.filter(
                              (val) => val.id !== idComplete
                            ),
                          };
                          $.ajax({
                            type: "PUT",
                            url: `https://getuser.vercel.app/api/updateUser/${val._id}`,
                            data: JSON.stringify(cartUser),
                            contentType: "application/json",
                            dataType: "json",
                          });
                        }
                      });
                    });
                  });
              },
              error: function (response) {
                alert("khong tim thay product", response);
              },
            });
          });
        });

        $("#btnComplete").click((e) => {
          $(".admin-input").fadeOut(400);
          const idComplete = $(btn).data().id;
          const newProduct = {
            name: $("#btnComplete").data().name,
            price: $("#btnComplete").data().price,
            img: $("#btnComplete").data().url,
            category: $("#btnComplete").data().category,
          };
          $.ajax({
            type: "PUT",
            url: `https://getuser.vercel.app/api/updateProduct/${idComplete}`,
            data: JSON.stringify(newProduct),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
              GetProductsFromAPI();
              fetch("https://getuser.vercel.app/api/getAllUser")
                .then((data) => data.json())
                .then((result) => {
                  result.forEach((val) => {
                    val.carts.forEach((valCart) => {
                      if (idComplete === valCart.id) {
                        const cartUser = {
                          carts: val.carts.filter(
                            (val) => val.id !== idComplete
                          ),
                        };
                        $.ajax({
                          type: "PUT",
                          url: `https://getuser.vercel.app/api/updateUser/${val._id}`,
                          data: JSON.stringify(cartUser),
                          contentType: "application/json",
                          dataType: "json",
                        });
                      }
                    });
                  });
                });
            },
            error: function (response) {
              alert("khong tim thay product", response);
            },
          });
        });
        $(".admin-input").fadeIn(400);
      });
    });

    // Button Delete:
    const btnDelete = document.querySelectorAll("#buttonDelete");
    btnDelete.forEach((btn) => {
      $(btn).click((e) => {
        e.preventDefault();
        if (confirm("confirm to delete this product!")) {
          const idProductDelete = $(btn).data().id;
          $.ajax({
            type: "DELETE",
            url: `https://getuser.vercel.app/api/deleteProduct/${idProductDelete}`,
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
              GetProductsFromAPI();
              fetch("https://getuser.vercel.app/api/getAllUser")
                .then((data) => data.json())
                .then((result) => {
                  result.forEach((val) => {
                    val.carts.forEach((valCart) => {
                      if (idProductDelete === valCart.id) {
                        const cartUser = {
                          carts: val.carts.filter(
                            (val) => val.id !== idProductDelete
                          ),
                        };
                        $.ajax({
                          type: "PUT",
                          url: `https://getuser.vercel.app/api/updateUser/${val._id}`,
                          data: JSON.stringify(cartUser),
                          contentType: "application/json",
                          dataType: "json",
                        });
                      }
                    });
                  });
                });
            },
            error: function (response) {
              alert("khong tim thay product", response);
            },
          });
        }
      });
    });
  };

  // Get data from _id in Database:
  GetDataFromId = (id) => {
    var result;
    ProductsDB.map((val) => {
      if (val._id == id) {
        result = val;
      }
    });
    return result;
  };

  // API:
  GetProductsFromAPI = () => {
    $("body").prepend(`
        <div class="form-loading">
            <ul>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>
    `);
    fetch("https://getuser.vercel.app/api/getAllProducts")
      .then((data) => data.json())
      .then((result) => {
        RenderCards(result, "all");
        searchProducts(result);
        SetProductsDB(result);
        $("body").find(".form-loading").remove();
      })
      .catch((err) => {
        alert("Something was wrong", err);
      });
  };

  function searchProducts(productsDB) {
    const input = document.querySelector(".form-search input");
    input.oninput = function (e) {
      const containProducts = productsDB.filter((val) =>
        val.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      RenderCards(containProducts, "all");
    };
  }

  GetProductsFromAPI();

  $(".add-new-product").click((e) => {
    e.preventDefault();
    $(".admin-input").html(`
        <div class="box-edit">
            <div class="left-content">
                <span id="title">Add New Product</span>
                <form action="">
                    <div class="group-input">
                        <label for="name">Name:</label>
                        <input type="text" name="" id="name">
                    </div>
                    <div class="group-input">
                        <label for="price">Price:</label>
                        <input type="text" name="" id="price">
                    </div>
                    <div class="group-input">
                        <label for="url">Image URL:</label>
                        <input type="text" name="" id="url">
                    </div>
                    <div class="group-input">
                        <label for="name">Category:</label>
                        <select name="" id="categories">
                            <option value="">vegetables</option>
                            <option value="">fruit</option>
                            <option value="">dried</option>
                            <option value="">frozen</option>
                            <option value="">organic</option>
                        </select>
                    </div>
                </form>
                <div class="group-button">
                    <button id="btnCancel">Cancel</button>
                    <button id="btnApply">Apply</button>
                </div>
            </div>
            <div class="right-content">
                <div class="card">
                    <div class="card-content">
                        <div class="img">
                            <div class="details">
                                <span id="nameAndPrice">name<br>$price<br>vegetables</span>
                            </div>
                            <img src="/icon/unknowimg.png" alt="">
                        </div>
                    </div>
                </div>
                <!-- <button id="btnComplete" data-name="none" data-price="none" data-url="none" data-category="none">Complete</button> -->
                <button id="btnComplete">Complete</button>
            </div>
        </div>
    `);

    $("#btnCancel").click((e) => {
      $(".admin-input").fadeOut(400);
    });

    $("#btnApply").click((e) => {
      if (
        $("#name").val() != "" &&
        $("#price").val() != "" &&
        $("#url").val() != ""
      ) {
        $(".right-content").html(`
                <div class="card">
                    <div class="card-content">
                        <div class="img">
                            <div class="details">
                                <span id="nameAndPrice">${$(
                                  "#name"
                                ).val()}<br>$${$("#price").val()}<br>${$(
          "#categories option:selected"
        ).text()}</span>
                            </div>
                            <img src=${$("#url").val()} alt="undefined!!!">
                        </div>
                    </div>
                </div>
                <button id="btnComplete" data-name="${$(
                  "#name"
                ).val()}" data-price="${$("#price").val()}" data-url="${$(
          "#url"
        ).val()}" data-category="${$(
          "#categories option:selected"
        ).text()}">Complete</button>
            `);

        $("#btnComplete").click((e) => {
          $(".admin-input").fadeOut(400);
          const newProduct = {
            name: $("#btnComplete").data().name,
            price: $("#btnComplete").data().price,
            image: $("#btnComplete").data().url,
            category: $("#btnComplete").data().category,
          };

          $.ajax({
            type: "POST",
            url: `https://getuser.vercel.app/api/AddProduct`,
            data: JSON.stringify(newProduct),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
              GetProductsFromAPI();
            },
            error: function (response) {
              alert("can't post", response);
            },
          });
        });
      } else {
        alert("invalid values!!!");
      }
    });

    $("#btnComplete").click((e) => {
      alert("can't complete (ERROR: invalid values)");
    });

    $(".admin-input").fadeIn(400);
  });

  // register admin
}
// #### ADMINS ####

// router.post("/AdminRegister", AdminRegister);
// router.get("/getAllAdmin", getAllAdmin);
// router.put("/updateAdmin/:id", updateAdmin);
// router.get("/getAAdmin/:id", getAAdmin);
// router.delete("/deleteAdmin/:id", deleteAdmin);
