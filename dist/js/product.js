const iduser = JSON.parse(localStorage.getItem("user"));

localStorage.removeItem("userid");
localStorage.removeItem("userBills");
localStorage.removeItem("cart");
localStorage.removeItem("user-checkout");
const cart = [];
let totalCart = 0;
if (JSON.parse(localStorage.getItem("checkRemember")) === false) {
  localStorage.removeItem("user");
}
let checkLoadUser = false;
let checkLoadPduct = false;
// if we have User login we must be render user to DOM
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
      if (checkLoadPduct) {
        // go to renerPdoructs() to detail
        $("body").find(".form-loading").remove();
      } else {
        checkLoadUser = true;
      }
      renderCartsUser(result);
    })
    .catch((err) => {
      alert("Something was wrong", err);
      $("body").find(".form-loading").remove();
    });
}
// call API to load database products and handle products and carts
renerPdoructs();
function renerPdoructs() {
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
      if (iduser) {
        // if User exist and loading in DOM we"ll delete form loading
        if (checkLoadUser) {
          $("body").find(".form-loading").remove();
        } else {
          // else if user loading after products we'll let user delete form loading
          checkLoadPduct = true;
        }
      } else {
        // if user dont exist the products delete loading itself
        $("body").find(".form-loading").remove();
      }
      wrapperProduct(result);
    })
    .catch((err) => {
      alert("Something was wrong", err);

      $("body").find(".form-loading").remove();
    });
}

function renderCartsUser(result) {
  $(".user-name").append(`${result.name}`).css({
    color: "#666",
    "font-size": "14px",
  });

  if (result.carts) {
    result.carts.forEach((val) => cart.push(val));

    renderCart();
    renderQuantity();
    delProductCart();

    $(".quantity").html(`${cart.length}`);
  }

  $(".action-user").html(`
   <li><a class="get-your-profile" href="./profile/profile.html">Your profile</a></li>
   <li><a class="get-purchase-order" href="">Purchase order</a></li>
   <li><a class="logout" href="./register/register.html">Longout</a></li>
  `);
  $(".get-purchase-order").click(function (e) {
    e.preventDefault();
    localStorage.setItem("userBills", JSON.stringify(iduser));
    window.location.href = "../formCheckout/formCheckout.html";
  });
  $(".logout").click(function (e) {
    e.preventDefault();
    localStorage.removeItem("user");
    location.reload();
  });

  $(".get-your-profile").click(function (e) {
    e.preventDefault();

    localStorage.setItem("userid", iduser);
    window.location.href = "../profile/profile.html";
  });
}

// update database users when reloading page
function updateDataUser() {
  const updateUser = {
    carts: [...cart],
  };
  if (iduser) {
    $.ajax({
      type: "PUT",

      url: `https://getuser.vercel.app/api/updateUser/${iduser}`,

      data: JSON.stringify(updateUser),

      contentType: "application/json",

      dataType: "json",

      error: function () {
        alert("Something was wrong");
      },
    });
  }
}

// handle products and carts

function wrapperProduct(productsDB) {
  // load database user

  const modalWrapper = document.querySelector(".modal-wrapper");

  $(".quantity").html(`${cart.length}`);
  const cards = document.querySelector(".cards");
  const menu1 = document.querySelector("#menu1");
  const menu2 = document.querySelector("#menu2");
  const menu3 = document.querySelector("#menu3");
  const menu4 = document.querySelector("#menu4");
  const menu5 = document.querySelector("#menu5");

  menuAll.addEventListener("click", function (e) {
    removeAndSetClassActive(menuAll);
    renderCards(productsDB);
  });
  menu1.addEventListener("click", function (e) {
    removeAndSetClassActive(menu1);
    renderCards(productsDB, "dried");
  });
  menu2.addEventListener("click", function (e) {
    removeAndSetClassActive(menu2);
    renderCards(productsDB, "frozen");
  });
  menu3.addEventListener("click", function (e) {
    removeAndSetClassActive(menu3);
    renderCards(productsDB, "fruit");
  });
  menu4.addEventListener("click", function (e) {
    removeAndSetClassActive(menu4);
    renderCards(productsDB, "organic");
  });
  menu5.addEventListener("click", function (e) {
    removeAndSetClassActive(menu5);
    renderCards(productsDB, "vegetables");
  });

  renderCards(productsDB);
  cartEvent();
  const input = document.querySelector(".form-search input");
  input.oninput = function (e) {
    const containProducts = productsDB.filter((val) =>
      val.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    renderCards(containProducts);
  };

  //get menu vegetables or fruits
  function removeAndSetClassActive(nameClassActive) {
    menuAll.classList.remove("active");
    menu1.classList.remove("active");
    menu2.classList.remove("active");
    menu3.classList.remove("active");
    menu4.classList.remove("active");
    menu5.classList.remove("active");
    nameClassActive.classList.add("active");
  }

  // get database product and render
  function renderCards(list, category) {
    let listString = "";
    if (category) {
      for (const todo of list) {
        if (todo.category === category) {
          listString += `
                    <div class="card" data-category="${todo.category}">
                        <div class="card-content">
                            <div class="img">
                                <img class="img-quick-view" src=${todo.image} data-id="${todo._id}"  alt="">
                            </div>
                            <div class="details">
                                <div class="name-price">
                                    <span class="name">${todo.name}</span>
                                    <span class="price">${todo.price}$</span>
                                </div>
                                <button><span data-id="${todo._id}" class="btnAddToCart"><i class="fa-solid fa-cart-shopping"></i></span></button>
                            </div>
                        </div>
                    </div>
                `;
        }
      }
    } else {
      for (const todo of list) {
        listString += `
                <div class="card" data-category="${todo.category}">
                    <div class="card-content">
                        <div class="img">
                            <img class="img-quick-view" src=${todo.image} data-id="${todo._id}" alt="">
                        </div>
                        <div class="details">
                            <div class="name-price">
                                <span class="name">${todo.name}</span>
                                <span class="price">${todo.price}$</span>
                            </div>
                            <button class="btn-add"><span data-id="${todo._id}" class="btnAddToCart"><i class="fa-solid fa-cart-shopping"></i></span></button>
                        </div>
                    </div>
                </div>
            `;
      }
    }
    cards.innerHTML = listString;
    productEvent(list);
  }

  // show detail product when click and add to cart
  function productEvent(productsDB) {
    const card = document.querySelectorAll(".card");

    card.forEach((element) => {
      const image = element.querySelector(".img-quick-view");

      image.addEventListener("click", function (e) {
        e.preventDefault();

        modalWrapper.classList.add("active");

        const quickView = document.querySelector(".quick-view");

        const idx = productsDB.findIndex(
          (val) => val._id === e.target.dataset.id
        );

        quickView.innerHTML = `
                <div class="quickview-image">
                    <img src=${productsDB[idx].image} alt=${
          productsDB[idx].name
        }>
                </div>
                <div class="quickview-details">
                    <span class="product-name">${productsDB[idx].name}</span>
                    <span class="product-price">${productsDB[
                      idx
                    ].category.toUpperCase()}  ${productsDB[idx].price} $</span>
                </div>
            `;

        const modal = document.querySelector(".modal-wrapper");

        modal.addEventListener("click", function (e) {
          if (e.target === modal) {
            modalWrapper.classList.remove("active");
          }
        });

        const btnClose = document.querySelector(".close");

        btnClose.addEventListener("click", function (event) {
          modalWrapper.classList.remove("active");
        });
      });
    });

    // click add to cart

    $(".btnAddToCart").click(function (e) {
      e.preventDefault();
      $(".cart-icon").addClass("cart-reng");
      setTimeout(() => {
        $(".cart-icon").removeClass("cart-reng");
      }, 300);
      const idClick = $(this).data("id");
      const getValue = productsDB.filter((val) => val._id === idClick);
      console.log("getValue:", getValue);
      const checkInCart = cart.findIndex((val) => val.id === idClick);
      if (cart.length === 0 || checkInCart < 0) {
        cart.push({
          img: getValue[0].image,
          name: getValue[0].name,
          price: getValue[0].price,
          id: getValue[0]._id,
          category: getValue[0].category,
          quantity: 1,
          total: getValue[0].price,
        });
        $(".quantity").html(`${cart.length}`);
        $(".go-checkout").remove("active-unselected");
      } else if (cart.length !== 0 || checkInCart >= 0) {
        const getValueQuantity = cart.findIndex(
          (val) => val.id === $(this).data("id")
        );
        cart[getValueQuantity].quantity += 1;
        cart[getValueQuantity].total += cart[getValueQuantity].price;
      }
      renderCart();
      renderQuantity();
      delProductCart();
      updateDataUser();
    });
  }

  // icon cart event show
  function cartEvent() {
    $(".cart-icon").click(function (e) {
      e.preventDefault();
      $(".wrapper-drop-dwon-cart").css({
        transform: "translateX(0)",
        transition: "0.3s",
      });

      $(".drop-down-cart").css(
        {
          opacity: "1",
          visibility: "visible",
          transition: "0.3s",
        },
        300
      );

      if (cart.length == 0) {
        $(".products-cart").find(".active-empty").remove();

        $(".products-cart").append(`
        <div class="active-empty">
          <img class="img-empty" src="/icon/empty-cart.png" alt="">
          <h3 class="title-empty">Your cart is empty</h3>
        </div>
      `);

        $(".go-checkout").addClass("active-unselected");
      } else {
        let totalCart = cart.reduce((acc, val) => {
          return acc + val.total;
        }, 0);

        $(".total-cart").html(`$${totalCart}`);

        $(".go-checkout").removeClass("active-unselected");
      }
    });

    $(".wrapper-drop-dwon-cart").click(function (e) {
      e.preventDefault();
      e.stopPropagation();
    });

    // ---------- close cart ---------------
    $(".drop-down-cart").click(function (e) {
      e.preventDefault();
      closeCart();
    });

    $(".btn-close-cart").click(function (e) {
      e.preventDefault();
      closeCart();
    });
  }

  // icon cart event hidden
  function closeCart() {
    $(".wrapper-drop-dwon-cart").css({
      transform: "translateX(100%)",
      transition: "0.3s",
    });

    $(".drop-down-cart").css(
      {
        opacity: "0",
        visibility: "hidden",
        transition: "0.3s",
      },
      300
    );
  }
}
// update database when cart changed
const updateCart = (a) => {
  const changeCart = cart.findIndex((val) => val.id === $(a).data("id"));

  cart[changeCart].quantity = +$(a).val();

  cart[changeCart].total = cart[changeCart].price * cart[changeCart].quantity;

  totalCart = cart.reduce((acc, val) => {
    return acc + val.total;
  }, 0);

  $(".total-cart").html(`$${totalCart}`);

  updateDataUser();
};

//render quantity cart
function renderQuantity() {
  $(".quantity-input-cart").change(function (e) {
    e.preventDefault();

    let inputChange = +e.target.value;

    if (inputChange < 1 || inputChange > 1000) {
      const getOldQuantity = cart.findIndex(
        (val) => val.id == $(this).data("id")
      );

      $(this).val(cart[getOldQuantity].quantity);

      alert("Input must be at least 1 and less than 1000");
    } else {
      updateCart(this);
    }
  });

  //----- click plus quantity ---------------

  $(".plus").click(function (e) {
    e.preventDefault();
    const getInputQuantity = $(this).parent().find(".quantity-input-cart");
    const getQuantity = getInputQuantity.val();
    if (+getQuantity < 1000) {
      getInputQuantity.val(`${+getQuantity + 1}`);
    }
    updateCart($(this).parent().find(".quantity-input-cart"));
  });

  // ----------- click btn minus -----------
  $(".minus").click(function (e) {
    e.preventDefault();
    const getInputQuantity = $(this).parent().find(".quantity-input-cart");
    const getQuantity = getInputQuantity.val();
    if (+getQuantity > 1) {
      getInputQuantity.val(`${+getQuantity - 1}`);
    }
    updateCart($(this).parent().find(".quantity-input-cart"));
  });
}

// ---------- delete product cart ---------
function delProductCart() {
  $(".btn-del-product").click(function (e) {
    e.preventDefault();
    const findDel = cart.findIndex((val) => val.id === $(this).data("id"));
    cart.splice(findDel, 1);
    $(".quantity").html(`${cart.length}`);
    renderCart();
    renderQuantity();
    delProductCart();
    updateDataUser();
    $(".quantity").html(`${cart.length}`);
    if (cart.length == 0) {
      $(".products-cart").append(`
      <div class="active-empty">
      <img class="img-empty" src="/icon/empty-cart.png" alt="">
      <h3 class="title-empty">Your cart is empty</h3>
      </div>
      `);
      $(".go-checkout").addClass("active-unselected");
      $(".total-cart").html(`$0.00`);
    } else {
      totalCart = cart.reduce((acc, val) => {
        return acc + val.total;
      }, 0);
      $(".total-cart").html(`$${totalCart}`);
    }
  });
}

// ---------- render cart -----------
function renderCart() {
  $(".products-cart").html("");
  cart.forEach((val) => {
    $(".products-cart").prepend(`
                      <div class="product">
                          <div class="content">
                              <img src="${val.img}"
                                  alt="">
                              <div class="action-cart">
                                  <div class="name-product">${val.name}</div>
                                  <div class="group-quantity-cart">
                                      <button data-id="${val.id}" class="minus"><i class="fa-solid fa-minus"></i></button>
                                      <input class="quantity-input-cart" type="number" data-id="${val.id}" value="${val.quantity}">
                                      <button data-id="${val.id}" class="plus"><i class="fa-solid fa-plus"></i></button>
                                      <div class="product-price">$${val.price}</div>
                                  </div>
                              </div>
                          </div>
                          <div class="btn-del-product" data-id="${val.id}">
                              <i class="fa-solid fa-xmark"></i>
                          </div>
                      </div>
      `);
  });
}

//go to checkout
$(".btn-checkout").click(function (e) {
  e.preventDefault();
  if (cart.length > 0) {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("user-checkout", JSON.stringify(iduser));
    window.location.href = "../formcheckout2/formcheckout2.html";
  }
});
