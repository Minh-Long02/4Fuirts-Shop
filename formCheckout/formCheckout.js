$("body").prepend(`
      <div class="form-loading">
      <ul>
          <li></li>
          <li></li>
          <li></li>
      </ul>
      </div>`);
const userid = JSON.parse(localStorage.getItem("userBills"));
function renderCartsBill(carts) {
  carts.forEach((val, index) => {
    val.forEach((vals) => {
      $(`.products-id-bills-${index}`).prepend(
        `
                              <div class="products" data-id="${vals.id}">
                                  <img src=${vals.img}
                                      alt="">
                                  <div class="product-content">
                                      <div class="name-product">${vals.name}</div>
                                      <div class="product-type">
                                          <div class="quantity">x${vals.quantity}</div>
                                          <div class="category">${vals.category}</div>
                                      </div>
                                      <div class="price">$${vals.price}</div>
  
                                  </div>
                              </div>     
      `
      );
    });
  });
}
let billCarts = [];
function renderBills(Bills) {
  const billsUser = Bills.filter((val) => val.userid === userid);
  if (billsUser.length > 0) {
    billsUser.forEach((val, index) => {
      $(".wrapper-checkout").prepend(`
              <div class="checkout-content">
                    <div class="datetime-order">${val.datetime}</div>
                    <div class="checkout-info">
                        <div class="products-and-adress products-id-bills-${index}">
                          
                        </div>
                        <div class="address">
                            <div class="delivery-address">
                                <h2>Delivery Adress</h2>
                            </div>
                            <h3 class="name-user">${val.name}</h3>
                            <div class="live phone-number">${val.phone}</div>
                            <div class="live stress">${val.adress}</div>
                            <div class="live coutry-city">${val.coutry} ${val.city}</div>
                            <h2 class="subtotal">
                                Subtotal: $${val.total}
                            </h2>
                        </div>
                    </div>
                </div>        
      `);
      billCarts.push(val.carts);
    });
    renderCartsBill(billCarts);
  } else {
    $(".wrapper-checkout").html(`
      <div class="wrapper-bill-empty"> 
      <img class="bill-empty" src="../icon/empty-cart.png" alt="">
      <h2>Your bill is empty</h2>
      </div>
      `);
  }
}

$(document).ready(function () {
  fetch("https://getuser.vercel.app/api/getAllBills")
    .then((data) => data.json())
    .then((result) => {
      renderBills(result);
      $("body").find(".form-loading").remove();
    })
    .catch((err) => {
      alert(`Something was wrong ${err}`);
      $("body").find(".form-loading").remove();
    });

  const body = $("html, body");
  //------- sự kiện scroll ---------

  //icon home
  const iconHome = $(".header-middle");
  //banner below
  //btn scroll to top
  const btnScrollTop = $(".btn-to-top");
  actionScroll();
  // catch eventing scroll window
  $(window).scroll(function () {
    actionScroll();
  });
  function actionScroll() {
    let top = $("html, body").scrollTop();
    //scrolling animation icon home
    if (top > 10) {
      iconHome.css({
        transform: "scale(0.7) translate(-72%, -45px)",
      });
    } else {
      iconHome.css({
        transform: "scale(1) translate(-50% ,10px)",
      });
    }
    //scrolling animation banner below

    //btn scrolling to top
    if (top >= 200) {
      btnScrollTop.addClass("action-show");
    } else {
      btnScrollTop.removeClass("action-show");
    }
  }

  //-----------sự kiện click-------------

  //----------- click to scroll to top ------------
  $(btnScrollTop).click(function (e) {
    e.preventDefault();
    body.animate(
      {
        scrollTop: 0,
      },
      500
    );
  });
});
