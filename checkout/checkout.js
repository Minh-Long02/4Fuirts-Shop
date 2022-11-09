const carts = JSON.parse(localStorage.getItem("cart"));
console.log("carts:", carts);

if (carts) {
  let total = 0;
  $(".cart-items").html("");
  carts.forEach((val) => {
    $(".cart-items").append(`
                    <div class="items">
                        <span class="name-items">${val.name} - <span>${val.category}</span> - <strong>x${val.quantity}</strong></span>
                        <span class="price-items">$${val.total}</span>
                    </div>
    `);
    total += val.total;
  });
  $(".total-price").html(`$${total}`);
}

$("#btn-gohome").click((e) => {
  e.preventDefault();
  $("#btn-gohome").addClass("active");
  // localStorage.removeItem("cart");
  setTimeout(() => {
    window.location.replace("/homev1.html");
  }, 300);
});
