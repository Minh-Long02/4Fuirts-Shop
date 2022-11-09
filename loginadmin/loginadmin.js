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
$("body").prepend(`
    <div class="form-loading">
    <ul>
        <li></li>
        <li></li>
        <li></li>
    </ul>
    </div>`);
$(document).ready(function () {
  const getUser = JSON.parse(localStorage.getItem("loginUser"));
  $("body").find(".form-loading").remove();
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
    fetch("https://getuser.vercel.app/api/getAllAdmin")
      .then((data) => data.json())
      .then((result) => {
        console.log(result);
        $("body").find(".form-loading").remove();
        if (inputUser.val() === "" || passwordUser.val() === "") {
          alert("Input can not be empty");
        } else {
          const getindxUser = result.findIndex(
            (val) =>
              (val.name === inputUser.val() || val.email === inputUser.val()) &&
              val.password === passwordUser.val()
          );
          if (getindxUser !== -1) {
            localStorage.setItem(
              "admin",
              JSON.stringify(result[getindxUser]._id)
            );

            window.location.href = "../admin.html";
          } else {
            alert("Admin not found or incorrect Password !");
          }
        }
      });
  });
});
