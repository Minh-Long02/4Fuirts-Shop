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
function testing(param) {
  const specialChar = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (specialChar.test(param) || param.includes(" ")) {
    return true;
  }
  return false;
}
function tesEmail(param) {
  const specialChar = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (specialChar.test(param)) {
    return false;
  }
  return true;
}
$(document).ready(function () {
  $(".btn-submit-register").click(function (e) {
    e.preventDefault();
    let dataUser = {
      email: "",
      name: "",
      password: "",
      carts: [],
    };
    dataUser.email = $(".register-input").val().trim();
    dataUser.name = $(".username-input").val().trim();
    dataUser.password = $(".confirm").val().trim();
    if (
      dataUser.email === "" ||
      dataUser.name === "" ||
      dataUser.password === ""
    ) {
      alert("Invalid value");
    } else if (tesEmail(dataUser.email)) {
      alert("Invalid eamil");
    } else if (testing(dataUser.name) || testing(dataUser.password)) {
      alert("Username and password must not have spaces or special characters");
    } else if (dataUser.name.length > 25) {
      alert("Name must be less than 25 characters");
    } else if (dataUser.name.length < 4) {
      alert("Name must be at least 4 characters");
    } else if (dataUser.password.length > 30) {
      alert("Password must be less than 30 characters");
    } else if (dataUser.password.length < 4) {
      alert("Password must be at least 4 characters");
    } else if (dataUser.password !== $(".register-pass").val()) {
      alert("The Password is different from the Confirm !");
    } else if (document.querySelector("#regis-check").checked === false) {
      alert("You must agree to privacy policy!");
      $(".checkbox-form").find("i").remove();
      $(".checkbox-form").append(`<i class="fa-solid fa-exclamation"></i>`);
    } else {
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
          const findNameUser = result.findIndex(
            (val) => val.name === dataUser.name
          );
          const findEmailUser = result.findIndex(
            (val) => val.email === dataUser.email
          );
          if (findEmailUser !== -1) {
            $("body").find(".form-loading").remove();
            alert("Email already exists");
          } else if (findNameUser !== -1) {
            $("body").find(".form-loading").remove();
            alert("Username already exists");
          } else {
            let newUser = { ...dataUser };

            $.ajax({
              type: "POST",
              url: "https://getuser.vercel.app/api/register",
              data: JSON.stringify(newUser),
              contentType: "application/json",
              dataType: "json",
              success: function () {
                localStorage.setItem("loginUser", JSON.stringify(dataUser));
                window.location.replace("../login/login.html");
              },
              error: function () {
                alert("Something was wrong");
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
  });
  $("#regis-check").click(function (e) {
    if (document.querySelector("#regis-check").checked === true) {
      $(".checkbox-form").find("i").remove();
      checkPass = true;
    } else {
      checkPass = false;
    }
  });
});
