let flag = true;
$(".show-pass").click(function (e) {
  e.preventDefault();
  const inputShow = $(this).parent();
  if (flag) {
    inputShow.find("input").attr("type", "text");
    inputShow.find("button").html(`<i class="fa-regular fa-eye"></i>`);
    flag = !flag;
  } else if (!flag) {
    inputShow.find("input").attr("type", "password");
    inputShow.find("button").html(`<i class="fa-regular fa-eye-slash"></i>`);
    flag = !flag;
  }
});
$(document).ready(function () {
  const getUser = JSON.parse(localStorage.getItem("loginUser"));
  localStorage.removeItem("loginUser");
  const inputUser = $(".login-input");
  const passwordUser = $(".login-pass");
  if (getUser) {
    inputUser.val(getUser.email);
    passwordUser.val(getUser.password);
  }
  $(".btn-submit-login").click(function (e) {
    e.preventDefault();
    $("body").prepend(`
    <div class="form-loading">
    <ul>
        <li></li>
        <li></li>
        <li></li>
    </ul>
    </div>`);
    fetch("https://getuser.vercel.app/api/getAllUser")
      .then((data) => data.json())
      .then((result) => {
        $("body").find(".form-loading").remove();
        if (inputUser.val() === "" || passwordUser.val() === "") {
          alert("Invalid value");
        } else {
          const getindxUser = result.findIndex(
            (val) =>
              (val.name === inputUser.val() || val.email === inputUser.val()) &&
              val.password === passwordUser.val()
          );
          if (getindxUser !== -1) {
            localStorage.setItem(
              "user",
              JSON.stringify(result[getindxUser]._id)
            );
            if (document.querySelector("#login-check").checked === true) {
              localStorage.setItem("checkRemember", JSON.stringify(true));
            } else {
              localStorage.setItem("checkRemember", JSON.stringify(false));
            }
            window.location.replace("../homev1.html");
          } else {
            alert("User not found or incorrect Password !");
          }
        }
      });
  });
});
