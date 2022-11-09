const body = $("html, body");

//------- sự kiện scroll ---------

const heightWin = $(window).height();
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

  $(btnScrollTop).click(function (e) {
    e.preventDefault();
    body.animate(
      {
        scrollTop: 0,
      },
      500
    );
  });
}

$(document).ready(function () {
  $(".wrapper-form-password").click(function (e) {
    e.stopPropagation();
  });
  $(".profile").click(function (e) {
    e.stopPropagation();
  });
  $(".btn-change-password").click(function (e) {
    e.preventDefault();
    $(".backgr").css({
      opacity: 1,
      visibility: "visible",
    });
  });

  $(".backgr").click(function (e) {
    e.preventDefault();
    $(this).css({
      opacity: 0,
      visibility: "hidden",
    });
  });
  $(".wrapper-profile").click(function (e) {
    $(".handle-profile").css({
      opacity: 0,
      visibility: "hidden",
    });
  });
  $(".btn-close").click(function (e) {
    e.preventDefault();
    $(".backgr").css({
      opacity: 0,
      visibility: "hidden",
    });
  });
});
