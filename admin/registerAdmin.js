$(document).ready(function () {
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
  $(".handle-register").click(function (e) {
    e.preventDefault();
    $(".handle-register").removeClass("show-register");
  });
  $(".wrapper-register").click(function (e) {
    e.preventDefault();
    e.stopPropagation();
  });
});

//check admin

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
  let checkForm = true;
  let checkPassword = true;
  let checkEmail = true;
  let checkLengthName = true;
  let checkLengthPass = true;
  let checkSpecial = true;
  $(".btn-submit-register").click(function (e) {
    e.preventDefault();

    fetch("https://getuser.vercel.app/api/getAllAdmin")
      .then((data) => data.json())
      .then((result) => {
        if (result.length > 6) {
          alert("Only add up to 6 admins");
          $("body").find(".form-loading").remove();
        } else {
          let dataUser = {
            email: "",
            name: "",
            password: "",
            permission: false,
          };
          dataUser.email = $(".register-input").val().trim();
          dataUser.name = $(".username-input").val().trim();
          console.log("dataUser.name:", dataUser.name.length);
          dataUser.password = $(".confirm").val().trim();
          console.log("dataUser.password:", dataUser.password.length);
          if (
            dataUser.email === "" ||
            dataUser.name === "" ||
            dataUser.password === ""
          ) {
            alert("Input must be filled");
            checkForm = false;
          } else if (testing(dataUser.name) || testing(dataUser.password)) {
            alert(
              "Username and password must not have spaces or special characters"
            );
            checkSpecial = false;
          } else if (tesEmail(dataUser.email)) {
            alert("Invalid email");
            checkSpecial = false;
          } else if (dataUser.name.length > 25) {
            alert("Name must be less than 25 characters");
            checkLengthName = false;
          } else if (dataUser.name.length < 4) {
            alert("Name must be at least 4 characters");
            checkLengthName = false;
          } else if (dataUser.password.length > 30) {
            alert("Password must be less than 30 characters");
            checkLengthPass = false;
          } else if (dataUser.password.length < 4) {
            alert("Password must be at least 4 characters");
            checkLengthPass = false;
          } else if (dataUser.password !== $(".register-pass").val()) {
            alert("The Password is different from the Confirm !");
            checkForm = false;
          } else {
            const findNameUser = result.findIndex(
              (val) => val.name === dataUser.name
            );
            const findEmailUser = result.findIndex(
              (val) => val.email === dataUser.email
            );
            if (findEmailUser !== -1) {
              alert("Email already exists");
              checkEmail = false;
            }
            if (findNameUser !== -1 && checkEmail === true) {
              alert("Admin already exists");
              checkPassword = false;
            }
          }
          if (
            checkForm === true &&
            checkPassword === true &&
            checkEmail === true &&
            checkLengthName === true &&
            checkLengthPass === true &&
            checkSpecial === true
          ) {
            $("body").prepend(`
              <div class="form-loading">
              <ul>
                <li></li>
                <li></li>
                <li></li>
                </ul>
             </div>`);
            let newUser = { ...dataUser };
            console.log("newUser:", newUser);
            $.ajax({
              type: "POST",
              url: "https://getuser.vercel.app/api/AdminRegister",
              data: JSON.stringify(newUser),
              contentType: "application/json",
              dataType: "json",
              success: function () {
                $("body").find(".form-loading").remove();
                alert("Register successed!");
              },
              error: function () {
                alert("Something was wrong");
                $("body").find(".form-loading").remove();
              },
            });
          } else {
            checkForm = true;
            checkEmail = true;
            checkPassword = true;
            checkLengthName = true;
            checkLengthPass = true;
            checkSpecial = true;
          }
        }
      })
      .catch((err) => {
        alert("Something was wrong", err);
        $("body").find(".form-loading").remove();
      });
  });
});
