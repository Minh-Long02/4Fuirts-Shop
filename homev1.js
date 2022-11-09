$(document).ready(function () {
  const body = $("html, body");
  const getbody = $("body");

  //------- sự kiện scroll ---------

  const heightWin = $(window).height();
  //icon home
  const iconHome = $(".header-middle");
  //banner below
  const bannerBelow = document.querySelectorAll(".wrapper-fruit");
  const topBannerBelow = $(".wrapper-banner").offset().top;
  const productGroup = $(".product-page").offset().top;
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
    if (top + heightWin >= topBannerBelow) {
      bannerBelow.forEach((val, index) => {
        val.classList.add(`action-banner-${index + 1}`);
      });
    }
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
  //----------- form login or rigister ---------

  $(".dried").click(function (e) {
    e.preventDefault();
    console.log(productGroup);
    body.animate(
      {
        scrollTop: productGroup,
      },
      300
    );
    $("#menu1").trigger("click");
  });

  $(".frozen").click(function (e) {
    e.preventDefault();
    console.log(productGroup);
    body.animate(
      {
        scrollTop: productGroup,
      },
      300
    );
    $("#menu2").trigger("click");
  });

  $(".fruits").click(function (e) {
    e.preventDefault();
    console.log(productGroup);
    body.animate(
      {
        scrollTop: productGroup,
      },
      300
    );
    $("#menu3").trigger("click");
  });

  $(".organic").click(function (e) {
    e.preventDefault();
    console.log(productGroup);
    body.animate(
      {
        scrollTop: productGroup,
      },
      300
    );
    $("#menu4").trigger("click");
  });

  $(".vegetables").click(function (e) {
    e.preventDefault();
    console.log(productGroup);
    body.animate(
      {
        scrollTop: productGroup,
      },
      300
    );
    $("#menu5").trigger("click");
  });
});
