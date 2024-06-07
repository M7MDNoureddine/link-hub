//on load user will see login page first
$(document).ready(function () {
  $(".register").hide();
  $(".login_li").addClass("active");

  $(".login_li").click(function () {
    $(this).addClass("active");
    $(".register_li").removeClass("active");
    $(".login").fadeIn();
    $(".register").hide();
  });

  $(".register_li").click(function () {
    $(this).addClass("active");
    $(".login_li").removeClass("active");
    $(".register").fadeIn();
    $(".login").hide();
  });
});
//prevent default submission of form to ensure ajax can work
$("form").submit(function (event) {
  event.preventDefault();
});

$("#email_error_message").hide();
$("#password_error_message").hide();
$("#retype_password_error_message").hide();
$("#user_error_message").hide();
$("#department_error_message").hide();

var error_email = false;
var error_password = false;
var error_retype_password = false;
var error_usertype = false;
var error_department = false;

//if user click another place without fill the information first, error message will show
$("#form_email").focusout(function () {
  check_email();
});
$("#form_password").focusout(function () {
  check_password();
});
$("#form_retype_password").focusout(function () {
  check_retype_password();
});
$("#form_usertype").focusout(function () {
  check_usertype();
});
$("#form_department").focusout(function () {
  check_department();
});

//check all input from user
function check_password() {
  var pattern =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
  var password_value = $("#form_password").val();
  if (password_value.match(pattern)) {
    $("#password_error_message").hide();
    $("#form_password").css("border-bottom", "2px solid #34F458");
  } else {
    $("#password_error_message").html(
      "Atleast 8 Characters with number,symbol,capital and small letter"
    );
    $("#password_error_message").show();
    $("#form_password").css("border-bottom", "2px solid #F90A0A");
    error_password = true;
  }
}

function check_retype_password() {
  var password = $("#form_password").val();
  var retype_password = $("#form_retype_password").val();
  if (password === retype_password) {
    $("#retype_password_error_message").hide();
    $("#form_retype_password").css("border-bottom", "2px solid #34F458");
  } else {
    $("#retype_password_error_message").html("Passwords Did not Matched");
    $("#retype_password_error_message").show();
    $("#form_retype_password").css("border-bottom", "2px solid #F90A0A");
    error_retype_password = true;
  }
}

function check_email() {
  var pattern = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  var email = $("#form_email").val();
  if (pattern.test(email) && email !== "") {
    $("#email_error_message").hide();
    $("#form_email").css("border-bottom", "2px solid #34F458");
  } else {
    $("#email_error_message").html("Invalid Email");
    $("#email_error_message").show();
    $("#form_email").css("border-bottom", "2px solid #F90A0A");
    error_email = true;
  }
}

function check_usertype() {
  var usertype = $("#form_usertype").val();
  if (jQuery.isEmptyObject(usertype)) {
    $("#user_error_message").html("Please choose your user type");
    $("#user_error_message").show();
    $("#form_usertype").css("border-bottom", "2px solid #F90A0A");
    error_usertype = true;
  } else {
    $("#user_error_message").hide();
    $("#form_usertype").css("border-bottom", "2px solid #34F458");
  }
}
function check_department() {
  var department = $("#form_department").val();
  if (jQuery.isEmptyObject(department)) {
    $("#department_error_message").html("Please choose your user type");
    $("#department_error_message").show();
    $("#form_department").css("border-bottom", "2px solid #F90A0A");
    error_department = true;
  } else {
    $("#department_error_message").hide();
    $("#form_department").css("border-bottom", "2px solid #34F458");
  }
}

//register functionality
$(".register-btn").click(function () {
  error_email = false;
  error_password = false;
  error_retype_password = false;
  error_usertype = false;
  error_department = false;

  check_email();
  check_password();
  check_retype_password();
  check_usertype();
  check_department();

  if (
    error_email === false &&
    error_password === false &&
    error_retype_password === false &&
    error_usertype === false &&
    error_department === false
  ) {
    $.ajax({
      type: "POST",
      url: "http://127.0.0.1:3000/register",
      data: $("#registration_form").serialize(),

      success: function (response, status, xhr) {
        let userData = JSON.parse(response);
        console.log(userData[0]);
        if (userData[0] == "Email already exists in database!") {
          alert(userData[0]);
          setTimeout(function () {
            $("#email_error_message").html("Email already exist!");
            $("#email_error_message").show();
            $("#form_email").css("border-bottom", "2px solid #F90A0A");
          }, 200);
        } else {
          alert(userData[0]);
          setTimeout(function () {
            location.reload(true);
          }, 200);
        }
      },
      error: function (xhr, status, error) {
        alert("Ajax connection error!");
      },
      async: true,
    });
  } else {
    alert("Please Fill the form Correctly");
    return false;
  }
});

$("#user_email_error_message").hide();
$("#user_password_error_message").hide();

var error_user_email = false;
var error_user_password = false;

$("#form_user_email").focusout(function () {
  check_user_email();
});
$("#form_user_password").focusout(function () {
  check_user_password();
});

function check_user_email() {
  var uemail = $("#form_user_email").val();
  var pattern = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  if (pattern.test(uemail)) {
    $("#user_email_error_message").hide();
    $("#form_user_email").css("border-bottom", "2px solid #34F458");

    if (uemail !== "") {
      $("#user_email_error_message").hide();
      $("#form_user_email").css("border-bottom", "2px solid #34F458");
    } else {
      $("#user_email_error_message").html("Email is empty");
      $("#user_email_error_message").show();
      $("#form_user_email").css("border-bottom", "2px solid #F90A0A");
      error_user_email = true;
    }
  } else {
    $("#user_email_error_message").html("Email Format is Incorrect");
    $("#user_email_error_message").show();
    $("#form_user_email").css("border-bottom", "2px solid #F90A0A");
    error_user_email = true;
  }
}

function check_user_password() {
  var upass = $("#form_user_password");
  if (upass.val() !== "") {
    $("#user_password_error_message").hide();
    $("#form_user_password").css("border-bottom", "2px solid #34F458");
  } else {
    $("#user_password_error_message").html("Password is empty");
    $("#user_password_error_message").show();
    $("#form_user_password").css("border-bottom", "2px solid #F90A0A");
    error_user_password = true;
  }
}
//login functionality
$(".login-btn").click(function () {
  error_user_email = false;
  error_user_password = false;

  check_user_email();
  check_user_password();
  var email = $("#form_user_email").val();
  var password = $("#form_user_password").val();

  if (error_user_email === false && error_user_password === false) {
    $.ajax({
      type: "POST",
      url: "http://127.0.0.1:3000/login",
      data: $("#login_form").serialize(),

      success: function (response, status, xhr) {
        let userData = JSON.parse(response);
        console.log(userData[0]);
        if (userData[0] == "wrong username/password!!") {
          alert(userData[0]);
          setTimeout(function () {
            $("#form_user_email").val(null);
            $("#form_user_password").val(null);
            $("#form_user_email").css("border-bottom", "2px solid #F90A0A");
            $("#form_user_password").css("border-bottom", "2px solid #F90A0A");
          }, 200);
        } else {
          sessionStorage.setItem("userType", userData[0]);
          sessionStorage.setItem("email", userData[1]);
          alert("Welcome back " + userData[1]);
          if (userData[0] == "admin") {
            setTimeout(function () {
              // Redirect to another page
              window.location.href = "admin.html";
            }, 200);
          } else if (userData[0] == "lecturer") {
            setTimeout(function () {
              // Redirect to another page
              window.location.href = "lecturer.html";
            }, 200);
          }
        }
      },
      error: function (xhr, status, error) {
        alert("Ajax connection error!");
      },
      async: true,
    });
  } else {
    alert("Please Fill in the login credential!");
  }
});
