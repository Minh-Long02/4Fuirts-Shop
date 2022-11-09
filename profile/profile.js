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

const getUserID = localStorage.getItem("userid");
if (getUserID) {
  $("body").prepend(`
      <div class="form-loading">
      <ul>
      <li></li>
      <li></li>
      <li></li>
      </ul>
    </div>`);
  fetch(`https://getuser.vercel.app/api/getAUser/${getUserID}`)
    .then((data) => data.json())
    .then((result) => {
      $("body").find(".form-loading").remove();
      $(".input-email").val(result.email);
      $(".input-username").val(result.name);
    });
}

$(document).ready(function () {
  //show form password
  $(".btn-change-password").click(function (e) {
    e.preventDefault();
    $(".backgr").css({
      opacity: 1,
      visibility: "visible",
    });
  });
  $(".wrapper-form-password").click(function (e) {
    e.stopPropagation();
  });

  // close form password
  $(".backgr").click(function (e) {
    e.preventDefault();
    $(this).css({
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

  //handle change email or username
  $(".btn-apply").click(function (e) {
    e.preventDefault();
    if (getUserID) {
      const getEmail = $(".input-email").val().trim();
      const getUsername = $(".input-username").val().trim();
      const getUserPassword = $(".input-password").val().trim();
      if (getEmail === "" || getUsername === "" || getUserPassword === "") {
        alert("Input can not be empty");
      } else if (testEmail(getEmail)) {
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
        fetch("https://getuser.vercel.app/api/getAllUser")
          .then((data) => data.json())
          .then((result) => {
            const checkNameUser = result.findIndex(
              (val) => val.name === getUsername && val._id !== getUserID
            );
            const checkEmailUser = result.findIndex(
              (val) => val.email === getEmail && val._id !== getUserID
            );
            const findPassword = result.findIndex(
              (val) => val._id === getUserID && val.password === getUserPassword
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
                url: `https://getuser.vercel.app/api/updateUser/${getUserID}`,
                data: JSON.stringify(updateUser),
                contentType: "application/json",
                dataType: "json",
                success: function () {
                  alert("changed success");
                  $("body").find(".form-loading").remove();
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
  function testing(param) {
    const specialChar = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (specialChar.test(param) || param.includes(" ")) {
      return true;
    }
    return false;
  }
  function testEmail(param) {
    const specialChar = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (specialChar.test(param)) {
      return false;
    }
    return true;
  }
  //handle change password
  $(".btn-changed-password").click(function (e) {
    e.preventDefault();

    if (getUserID) {
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
        alert("Password must be less than 30 characters");
      } else {
        $("body").prepend(`
                <div class="form-loading">
                  <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                  </ul>
                </div>`);
        fetch(`https://getuser.vercel.app/api/getAUser/${getUserID}`)
          .then((data) => data.json())
          .then((result) => {
            if (result.password !== oldPassword) {
              $("body").find(".form-loading").remove();

              alert("Incorrect password!");
            } else {
              $.ajax({
                type: "PUT",
                url: `https://getuser.vercel.app/api/updateUser/${getUserID}`,
                data: JSON.stringify({ password: comfirmPassword }),
                contentType: "application/json",
                dataType: "json",
                success: function () {
                  alert("changed success");
                  $("body").find(".form-loading").remove();
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
});
