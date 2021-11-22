'use strict';

/* ===  DOM-jQuery  Objects  === */
const $loginForm             = $("section#section_login #form_container form");
const $loginFormInputId      = $loginForm.find("input[name=id]");
const $loginFormInputPw      = $loginForm.find("input[name=password]");
const $loginFormButtonLogin  = $loginForm.find("#form_submit_button");
const $loginFormErrorMsg     = $loginForm.find("#form_error_container");
/* ============================= */

/* ===      Event Setup      === */
$loginFormInputId.on("input change", login_UpdateLoginButtonAvailability).on("keypress", login_LoginOnEnterCallback);
$loginFormInputPw.on("input change", login_UpdateLoginButtonAvailability).on("keypress", login_LoginOnEnterCallback);
$loginFormButtonLogin.click(login_TryLogin);
/* ============================= */

/* === Functions / Callbacks === */
function login_UpdateLoginButtonAvailability() {
    if($loginFormInputId.val().length > 0 &&
       $loginFormInputPw.val().length > 0 &&
       !(/[^a-zA-Z0-9\_]+/g.test($loginFormInputId.val()))) {
        $loginFormButtonLogin.removeAttr("disabled");
    } else {
        $loginFormButtonLogin.attr("disabled", "disabled");
    }
}

function login_LoginOnEnterCallback(event) {
    if(event.originalEvent.keyCode === 13 &&
       !$loginFormButtonLogin[0].hasAttribute("disabled")) {
        $loginFormButtonLogin.click();
    }
}

function login_TryLogin() {
    $loginFormButtonLogin.attr("disabled", "disabled");
    $loginFormInputId.attr("disabled", "disabled");
    $loginFormInputPw.attr("disabled", "disabled");
    login_SetAndShowErrorMessage("로그인 중입니다...");

    $.ajax({
        type: "POST",
        url:  "/action/login.php",
        data: {
            id:       $loginFormInputId.val(),
            password: $loginFormInputPw.val()
        }
    }).done(function(data) {
        if(data.result === "success" && data.message == 0) {
            window.location.href = "/";
        } else if(data.result === "success" && data.message == 1) {
            window.location.href = "/el-cs/";
        } else {
            login_SetAndShowErrorMessage(data.message);
            login_ResetLoginForm();
        }
    }).fail(function() {
        login_SetAndShowErrorMessage("로그인할 수 없습니다. (AJAX 실패)");
        login_ResetLoginForm();
    });
}

function login_SetAndShowErrorMessage(message) {
    $loginFormErrorMsg.text(message);
}

function login_ResetLoginForm() {
    $loginForm[0].reset();
    $loginFormInputId.removeAttr("disabled").val("").focus();
    $loginFormInputPw.removeAttr("disabled").val("");
    $loginFormButtonLogin.attr("disabled", "disabled");
}
/* ============================= */