// Requires index.js

'use strict';

/* === DOM-jQuery  Objects === */
const $manageSection                                    = $("section#section_manage");
let   $manageSectionAllFloatingItems                    = $manageSection.find(".floating_item");

/* Top popups */
let   $manageSubaccountResetPasswordPopup               = $manageSection.find("#subaccount_reset_password_container");
const $manageSubaccountResetPasswordPopupForm           = $manageSubaccountResetPasswordPopup.find("#subaccount_reset_password_input_container");
const $manageSubaccountResetPasswordPopupFormInputs     = {
    Confirm:  $manageSubaccountResetPasswordPopupForm.find(".confirm_button"),
    Password: $manageSubaccountResetPasswordPopupForm.find("input[type=password]"),
    Cancel:   $manageSubaccountResetPasswordPopupForm.find(".cancel_button")
};

let   $manageSubaccountEditInfoPopup                    = $manageSection.find("#subaccount_edit_container");
const $manageSubaccountEditInfoPopupForm                = $manageSubaccountEditInfoPopup.find("#subaccount_edit_input_container");
const $manageSubaccountEditInfoPopupFormInputs          = {
    Name:          $manageSubaccountEditInfoPopupForm.find("input.name"),
    Company:       $manageSubaccountEditInfoPopupForm.find("input.company"),
    Field:         $manageSubaccountEditInfoPopupForm.find("input.field"),
    AllTextInputs: $manageSubaccountEditInfoPopupForm.find("input[type=text]"),
    Confirm:       $manageSubaccountEditInfoPopupForm.find(".confirm_button"),
    Cancel:        $manageSubaccountEditInfoPopupForm.find(".cancel_button")
};

let   $manageCarEditInfoPopup                           = $manageSection.find("#car_info_edit_container");
const $manageCarEditInfoPopupForm                       = $manageCarEditInfoPopup.find("#car_info_edit_input_container");
const $manageCarEditInfoPopupFormInputs                 = {
    Description:  $manageCarEditInfoPopupForm.find("input.description"),
    Confirm:      $manageCarEditInfoPopupForm.find(".confirm_button"),
    Cancel:       $manageCarEditInfoPopupForm.find(".cancel_button")
};
const $manageCarResetCallingStatusContainer             = $manageCarEditInfoPopup.find("#car_reset_call_status_container");
const $manageCarResetCallingStatusButton                = $manageCarResetCallingStatusContainer.find(".reset_calling_status_button");
/* --- */

/* Under subaccount manage container */
const $manageSubaccountContainer                        = $manageSection.find("#subaccount_manage_container");

const $manageSubaccountCreateForm                       = $manageSubaccountContainer.find("#subaccount_create_container form");
const $manageSubaccountCreateFormInputs                 = {
    ID:      $manageSubaccountCreateForm.find("input[name=id]"),
    PW:      $manageSubaccountCreateForm.find("input[name=pw]"),
    Name:    $manageSubaccountCreateForm.find("input[name=name]"),
    Company: $manageSubaccountCreateForm.find("input[name=company]"),
    Field:   $manageSubaccountCreateForm.find("input[name=field]"),
    Add:     $manageSubaccountCreateForm.find("#subaccount_create_add_button"),
    Reset:   $manageSubaccountCreateForm.find("#subaccount_create_reset_button")
};

const $manageSubaccountInnerContainer                   = $manageSubaccountContainer.find("#subaccount_manage_inner_container");
let   $manageSubaccountAllItems                         = $manageSubaccountInnerContainer.find(".account_item");
/* --- */

/* Under car permission manage container */
const $manageCarPermissionContainer                     = $manageSection.find("#car_permission_container");
const $manageCarPermissionInnerContainer                = $manageCarPermissionContainer.find("#car_permission_inner_container");
const $manageCarPermissionAllItems                      = $manageCarPermissionInnerContainer.find(".car_item");
/* =========================== */

/* ===     Event Setup     === */
$manageSubaccountCreateFormInputs.ID.on("input change", manage_ValidateSubaccountCreateForm).on("keypress", manage_SubmitSubaccountCreateForm);
$manageSubaccountCreateFormInputs.PW.on("input change", manage_ValidateSubaccountCreateForm).on("keypress", manage_SubmitSubaccountCreateForm);
$manageSubaccountCreateFormInputs.Name.on("input change", manage_ValidateSubaccountCreateForm).on("keypress", manage_SubmitSubaccountCreateForm);
$manageSubaccountCreateFormInputs.Company.on("input change", manage_ValidateSubaccountCreateForm).on("keypress", manage_SubmitSubaccountCreateForm);
$manageSubaccountCreateFormInputs.Field.on("input change", manage_ValidateSubaccountCreateForm).on("keypress", manage_SubmitSubaccountCreateForm);
$manageSubaccountCreateFormInputs.Reset.click(function() { $manageSubaccountCreateForm[0].reset(); });
$manageSubaccountCreateFormInputs.Add.click(manage_CreateSubaccount);

$manageSubaccountResetPasswordPopup.on("keydown", function(e) { if(e.originalEvent.keyCode === 27) manage_CloseResetPasswordDialog(); });
$manageSubaccountResetPasswordPopupFormInputs.Cancel.click(manage_CloseResetPasswordDialog);
$manageSubaccountResetPasswordPopupFormInputs.Confirm.click(manage_AccountResetPasswordFromPopup);
$manageSubaccountEditInfoPopup.on("keydown", function(e) { if(e.originalEvent.keyCode === 27) manage_CloseSubaccountEditInfoDialog(); });
$manageSubaccountEditInfoPopupFormInputs.Cancel.click(manage_CloseSubaccountEditInfoDialog);
$manageSubaccountEditInfoPopupFormInputs.Confirm.click(manage_AccountModifyInfoFromPopup);
$manageCarEditInfoPopup.on("keydown", function(e) { if(e.originalEvent.keyCode === 27) manage_CloseCarEditInfoDialog(); });
$manageCarEditInfoPopupFormInputs.Cancel.click(manage_CloseCarEditInfoDialog);
$manageCarEditInfoPopupFormInputs.Confirm.click(manage_CarEditInfoFromPopup);
$manageCarResetCallingStatusButton.click(manage_CarResetCallingFlag);

$manageCarPermissionAllItems.click(function() {
    if($manageSubaccountInnerContainer.find(".account_item.active").length <= 0) return false;

    manage_ToggleCarPermission($manageSubaccountInnerContainer.find(".account_item.active").data("index"),
                               $(this).attr("data-hash"));
});

$manageSubaccountResetPasswordPopupFormInputs.Password.on("input change", function() {
    if($(this).val().length < 8) $manageSubaccountResetPasswordPopupFormInputs.Confirm.attr("disabled", "disabled");
    else $manageSubaccountResetPasswordPopupFormInputs.Confirm.removeAttr("disabled");
}).on("keypress", function(e) {
    if(e.keyCode === 13 && !$manageSubaccountResetPasswordPopupFormInputs.Confirm[0].hasAttribute("disabled")) $manageSubaccountResetPasswordPopupFormInputs.Confirm.click();
});

$manageSubaccountEditInfoPopupFormInputs.AllTextInputs.on("input change", function() {
    if($manageSubaccountEditInfoPopupFormInputs.Name.val().length > 0 &&
       $manageSubaccountEditInfoPopupFormInputs.Company.val().length > 0 &&
       $manageSubaccountEditInfoPopupFormInputs.Field.val().length > 0) {
        $manageSubaccountEditInfoPopupFormInputs.Confirm.removeAttr("disabled");
    } else {
        $manageSubaccountEditInfoPopupFormInputs.Confirm.attr("disabled", "disabled");
    }
}).on("keypress", function(e) {
    if(e.keyCode === 13 && !$manageSubaccountEditInfoPopupFormInputs.Confirm[0].hasAttribute("disabled")) $manageSubaccountEditInfoPopupFormInputs.Confirm.click();
});

$manageCarPermissionAllItems.find(".car_edit_info").click(function(event) {
    event.stopPropagation();

    let $parentContainer = $(this).closest(".car_item");

    manage_ShowCarEditInfoDialog($parentContainer.attr("data-hash"), $parentContainer.find(".car_name").text(), $parentContainer.find(".car_desc").text());
}).hover(function () {
    common_ShowToolTip($(this), $(this).data("tooltip"));
}, function() {
    common_DismissToolTip($(this).find(".tooltip"));
});

$manageCarEditInfoPopupFormInputs.Description.on("input change", function() {
    if($manageCarEditInfoPopupFormInputs.Description.val().length > 0) {
        $manageCarEditInfoPopupFormInputs.Confirm.removeAttr("disabled");
    } else {
        $manageCarEditInfoPopupFormInputs.Confirm.attr("disabled", "disabled");
    }
}).on("keypress", function(e) {
    if(e.keyCode === 13 && !$manageCarEditInfoPopupFormInputs.Confirm[0].hasAttribute("disabled")) $manageCarEditInfoPopupFormInputs.Confirm.click();
});
/* =========================== */

/* ===  Executed  on Load  === */
$(function() {
    $manageSubaccountAllItems.each((_, e) => manage_SetSubaccountEvent(e));
    if(typeof($manageSubaccountAllItems.first()) != "undefined" && $manageSubaccountAllItems.first() != null && $manageSubaccountAllItems.first().length > 0) manage_SwitchActiveAccount($manageSubaccountAllItems.first().data("index"));
});
/* =========================== */

/* === Functions&Callbacks === */
function manage_AccountModifyInfoFromPopup() {
    $.ajax({
        method: "POST",
        url: "/action/modify-subaccount-info.php",
        data: {
            index: $manageSubaccountEditInfoPopup.attr("data-index"),
            name: $manageSubaccountEditInfoPopupFormInputs.Name.val(),
            // company: $manageSubaccountEditInfoPopupFormInputs.Company.val(),
            field: $manageSubaccountEditInfoPopupFormInputs.Field.val(),
        }
    }).done(function(data) {
        if(data.result === "success") {
            alert("성공적으로 계정의 정보를 변경했습니다. 현재 이 계정이 로그인되어 있는 경우, 로그아웃 후 다시 로그인해야 반영됩니다.");

            data.message = JSON.parse(data.message);

            let $targetAccountItem = $manageSubaccountInnerContainer.find(`.account_item[data-index=${$manageSubaccountEditInfoPopup.attr("data-index")}]`);
            $targetAccountItem.find(".account_name").text(data.message.name);
            // $targetAccountItem.find(".account_location .company").text(data.message.company);
            $targetAccountItem.find(".account_location .field").text(data.message.field);
            
            manage_CloseSubaccountEditInfoDialog();
        } else {
            alert("계정의 정보를 변경할 수 없습니다. " + data.message);
        }
    }).fail(function() {
        alert("계정의 정보를 변경할 수 없습니다. (AJAX 실패)");
    });
}

function manage_AccountResetPasswordFromPopup() {
    $.ajax({
        method: "POST",
        url: "/action/reset-subaccount-password.php",
        data: {
            index:    $manageSubaccountResetPasswordPopup.attr("data-index"),
            password: $manageSubaccountResetPasswordPopupFormInputs.Password.val()
        }
    }).done(function(data) {
        if(data.result === "success") {
            alert("성공적으로 계정 비밀번호를 변경했습니다.");
            manage_CloseResetPasswordDialog();
        } else {
            alert("계정의 비밀번호를 변경할 수 없습니다. " + data.message);
        }
    }).fail(function() {
        alert("계정의 비밀번호를 변경할 수 없습니다. (AJAX 실패)");
    });
}

function manage_CarEditInfoFromPopup() {
    $.ajax({
        method: "POST",
        url: "/action/modify-car-info.php",
        data: {
            hash: $manageCarEditInfoPopup.attr("data-hash"),
            description: $manageCarEditInfoPopupFormInputs.Description.val()
        }
    }).done(function(data) {
        if(data.result === "success") {
            alert("성공적으로 장치의 정보를 변경했습니다.");

            data.message = JSON.parse(data.message);

            let $targetCarItem = $dashboardDeviceItems.filter(`[data-hash=${$manageCarEditInfoPopup.attr("data-hash")}]`);
            $targetCarItem.find(".description > span").text(data.message.description);
            $targetCarItem = $manageCarPermissionAllItems.filter(`[data-hash=${$manageCarEditInfoPopup.attr("data-hash")}]`);
            $targetCarItem.find(".car_desc").text(data.message.description);

            manage_CloseCarEditInfoDialog();
        } else {
            alert("장치의 정보를 변경할 수 없습니다. " + data.message);
        }
    }).fail(function() {
        alert("장치의 정보를 변경할 수 없습니다. (AJAX 실패)");
    });
}

function manage_CarResetCallingFlag() {
    $.ajax({
        method: "POST",
        url: "/action/set-car-emergency-flag.php",
        data: {
            hash: $manageCarEditInfoPopup.attr("data-hash"),
            set_calling: 0
        }
    }).done(function(data) {
        if(data.result === "success") {
            alert("장치의 통화 중 상태가 초기화되었습니다.");
            manage_CloseCarEditInfoDialog();
        } else {
            alert("통화 중 상태를 초기화할 수 없습니다. " + data.message);
        }
    }).fail(function() {
        alert("통화 중 상태를 초기화할 수 없습니다. (AJAX 실패)");
    });
}

function manage_CreateSubaccount() {
    $.ajax({
        type: "POST",
        url: "/action/add-subaccount.php",
        data: {
            id:       $manageSubaccountCreateFormInputs.ID.val(),
            password: $manageSubaccountCreateFormInputs.PW.val(),
            name:     $manageSubaccountCreateFormInputs.Name.val(),
            company:  $manageSubaccountCreateFormInputs.Company.val(),
            field:    $manageSubaccountCreateFormInputs.Field.val()
        }
    }).done(function(data) {
        if(data.result === "success") {
            data.message = JSON.parse(data.message);
            
            let createdDate = new Date(data.message.created_at);
            let $createdAccountElement = $(`<div class='account_item floating_item' data-index=${data.message.index}>` +
                "<div class='index_container'>" + 
                    "<div>Index</div>" +
                    `<div class='account_index'>${data.message.index}</div>` +
                "</div>" +
                "<div class='id_container'>" +
                    `<div class='account_name'>${data.message.name}</div>` +
                    `<div class='account_id'>ID : ${data.message.id}</div>` +
                "</div>" +
                "<div class='info_container'>" +
                    `<div class='account_location'><i class='la la-map-marker' aria-hidden='true'></i><span class='company'>${data.message.company}</span> <span class='field'>${data.message.field}</span></div>` +
                    `<div class='account_created_date'><i class='la la-calendar-o' aria-hidden='true'></i>${createdDate.getFullYear()}/${createdDate.getMonth() + 1}/${createdDate.getDate()}에 계정 생성</div>` +
                    `<div class='account_last_login'><i class='la la-clock-o' aria-hidden='true'></i>로그인 한 적 없음</div>` +
                "</div>" +
                "<div class='account_control_container'>" +
                    "<i class='reset_password la la-refresh' aria-hidden='true' data-tooltip='비밀번호 재설정'></i>"+
                    "<i class='edit la la-edit' aria-hidden='true' data-tooltip='정보 수정'></i>" +
                    "<i class='remove la la-user-times' aria-hidden='true' data-tooltip='계정 삭제'></i>" +
                "</div>" +
            "</div>");
            $createdAccountElement.appendTo($manageSubaccountInnerContainer);

            $manageSubaccountCreateForm[0].reset();

            manage_UpdateExistingJqueryObjects();
            manage_SwitchActiveAccount(data.message.index);
            manage_SetSubaccountEvent($createdAccountElement);
        } else {
            alert(data.message);
        }
    });
    
    return false;
}

function manage_SetSubaccountEvent(element) {
    $(element).find(".account_control_container > i").off();

    $(element).find(".account_control_container > i").hover(function() {
        common_ShowToolTip($(this), $(this).data("tooltip"));
    }, function() {
        common_DismissToolTip($(this).find(".tooltip"));
    });
    
    $(element).find(".account_control_container .reset_password").click(function(event) {
        event.stopPropagation();

        let $parentContainer = $(this).closest(".account_item");

        manage_ShowResetPasswordDialog($parentContainer.attr("data-index"), $parentContainer.find(".account_name").text());
    });

    $(element).find(".account_control_container .edit").click(function(event) {
        event.stopPropagation();

        let $parentContainer = $(this).closest(".account_item");

        manage_ShowSubaccountEditInfoDialog($parentContainer.attr("data-index"),
                                            $parentContainer.find(".account_name").text(),
                                            $parentContainer.find(".account_name").text(),
                                            $parentContainer.find(".account_location .company").text(),
                                            $parentContainer.find(".account_location .field").text());
    });

    $(element).find(".account_control_container .remove").click(function(event) {
        event.stopPropagation();
        
        let $parentAccountItemElement = $(this).closest(".account_item");

        if(confirm(`${$parentAccountItemElement.find(".account_name").text()} - 계정을 삭제하시겠습니까?`)) {
            $.ajax({
                method: "POST",
                url: "/action/remove-subaccount.php",
                data: { index: $parentAccountItemElement.find(".account_index").text() }
            }).done(function(data) {
                if(data.result === "success") {
                    $parentAccountItemElement.fadeOut(500, function() {
                        $parentAccountItemElement.remove();
                        manage_UpdateExistingJqueryObjects();
    
                        if($parentAccountItemElement.hasClass("active")) {
                            $manageSubaccountAllItems.first().click();
                        }
                    });
                } else {
                    alert("계정을 삭제할 수 없습니다. " + data.message);
                }
            }).fail(function() {
                alert("계정을 삭제할 수 없습니다. (AJAX 실패)");
            });
        }
    });

    $(element).click(function() {
        manage_SwitchActiveAccount($(this).data("index"));
    });
}

function manage_UpdateExistingJqueryObjects() {
    /* Update existing jQuery DOM objects (to include added element into them) */
    $manageSectionAllFloatingItems = $manageSection.find(".floating_item");
    $manageSubaccountAllItems      = $manageSubaccountInnerContainer.find(".account_item");

    $manageSubaccountResetPasswordPopup = $manageSection.find("#subaccount_reset_password_container");
    $manageSubaccountEditInfoPopup      = $manageSection.find("#subaccount_edit_container");
    $manageCarEditInfoPopup             = $manageSection.find("#car_info_edit_container");
    /* --- */
}

function manage_ValidateSubaccountCreateForm() {
    if($manageSubaccountCreateFormInputs.ID.val().length > 0 &&
       $manageSubaccountCreateFormInputs.PW.val().length >= 8 &&
       $manageSubaccountCreateFormInputs.Name.val().length > 0 &&
       $manageSubaccountCreateFormInputs.Company.val().length > 0 &&
       $manageSubaccountCreateFormInputs.Field.val().length > 0 &&
       !(/[^a-zA-Z0-9\_]+/g.test($manageSubaccountCreateFormInputs.ID.val()))) {
        $manageSubaccountCreateFormInputs.Add.removeAttr("disabled");
    } else {
        $manageSubaccountCreateFormInputs.Add.attr("disabled", "disabled");
    }
}

function manage_SubmitSubaccountCreateForm(event) {
    if(event.originalEvent.charCode === 13 && !$manageSubaccountCreateFormInputs.Add[0].hasAttribute("disabled")) {
        $manageSubaccountCreateFormInputs.Add.click();
    }
}

function manage_SwitchActiveAccount(index) {
    $manageSectionAllFloatingItems.removeClass("active");

    $manageSubaccountInnerContainer.find(`.account_item[data-index=${index}]`).addClass("active");

    $.ajax({
        method: "POST",
        url: "/action/get-accessible-cars.php",
        data: { index: index }
    }).done(function(data) {
        if(data.result === "success") {
            manage_UpdateCarsView(JSON.parse(data.message));
        } else {
            alert("접근 가능한 장치 목록 가져오기 실패. " + data.message);
            $manageSectionAllFloatingItems.removeClass("active");
        }
    }).fail(function() {
        alert("접근 가능한 장치 목록 가져오기 실패 (AJAX 실패)");
        $manageSectionAllFloatingItems.removeClass("active");
    });
}

function manage_UpdateCarsView(activeCarHashList) {
    $manageCarPermissionAllItems.removeClass("active");

    for(let i in activeCarHashList) {
        $manageCarPermissionInnerContainer.find(`.car_item[data-hash=${activeCarHashList[i]}]`).addClass("active");
    }
}

function manage_ToggleCarPermission(operatorIndex, carHash) {
    let $carItem = $manageCarPermissionInnerContainer.find(`.car_item[data-hash=${carHash}]`);
    let toggleTo = $carItem.hasClass("active") ? "0" : "1";

    $.ajax({
        method: "POST",
        url: "/action/set-car-permission.php",
        data: { index: operatorIndex, hash: carHash, value: toggleTo }
    }).done(function(data) {
        if(data.result === "success") {
            if($carItem.hasClass("active")) $carItem.removeClass("active");
            else $carItem.addClass("active");

            if(data.message.split(",").indexOf("-1") >= 0 || data.message == null || data.message.trim() == "") $carItem.find(".car_unassigned").css("display", "");
            else $carItem.find(".car_unassigned").css("display", "none");
        } else {
            alert("장치 접근 권한 설정 실패. " + data.message);
        }
    }).fail(function() {
        alert("장치 접근 권한 설정 실패 (AJAX 실패)");
    });
}

function manage_ShowResetPasswordDialog(operatorIndex, accountName) {
    $manageSubaccountResetPasswordPopup.addClass("show")
                                       .attr("data-index", operatorIndex)
                                       .find(".heading").text(`${operatorIndex}. ${accountName}`);
    $manageSubaccountResetPasswordPopupFormInputs.Password.removeAttr("disabled")
                                                          .focus();
    common_Blackout();
    manage_UpdateExistingJqueryObjects();
}

function manage_CloseResetPasswordDialog() {
    $manageSubaccountResetPasswordPopup.removeClass("show")
                                       .removeAttr("data-index")
                                       .find(".heading").text("　");
    common_BlackoutEnd();
    $manageSubaccountResetPasswordPopupFormInputs.Password.val("")
                                                          .attr("disabled", "disabled");
    $manageSubaccountResetPasswordPopupFormInputs.Confirm.attr("disabled", "disabled");
    manage_UpdateExistingJqueryObjects();
}

function manage_ShowSubaccountEditInfoDialog(operatorIndex, accountName, name, company, field) {
    $manageSubaccountEditInfoPopup.addClass("show")
                                  .attr("data-index", operatorIndex)
                                  .find(".heading").text(`${operatorIndex}. ${accountName}`);
    $manageSubaccountEditInfoPopupFormInputs.AllTextInputs.removeAttr("disabled");
    $manageSubaccountEditInfoPopupFormInputs.Name.val(name).focus();
    $manageSubaccountEditInfoPopupFormInputs.Company.val(company).attr("disabled", "disabled");
    $manageSubaccountEditInfoPopupFormInputs.Field.val(field);
    common_Blackout();
    manage_UpdateExistingJqueryObjects();
}

function manage_CloseSubaccountEditInfoDialog() {
    $manageSubaccountEditInfoPopup.removeClass("show")
                                  .removeAttr("data-index")
                                  .find(".heading").text("　");
    common_BlackoutEnd();
    $manageSubaccountEditInfoPopupForm[0].reset();
    $manageSubaccountEditInfoPopupFormInputs.AllTextInputs.val("")
                                                          .attr("disabled", "disabled");
    $manageSubaccountEditInfoPopupFormInputs.Confirm.attr("disabled", "disabled");
    manage_UpdateExistingJqueryObjects();
}

function manage_ShowCarEditInfoDialog(carHash, carName, carDesc) {
    $manageCarEditInfoPopup.addClass("show")
                           .attr("data-hash", carHash)
                           .find(".heading").text(carName);
    $manageCarEditInfoPopupFormInputs.Description.removeAttr("disabled")
                                                 .val(carDesc)
                                                 .focus();
    
    if($dashboardDeviceItems.filter(`[data-hash=${carHash}]`).hasClass(DEVICE_STATUS_CLASS_CALLING)) {
        $manageCarResetCallingStatusContainer.css("display", "");
    } else {
        $manageCarResetCallingStatusContainer.css("display", "none");
    }

    common_Blackout();
    manage_UpdateExistingJqueryObjects();
}

function manage_CloseCarEditInfoDialog() {
    $manageCarEditInfoPopup.removeClass("show")
                           .removeAttr("data-hash")
                           .find(".heading").text("　");
    common_BlackoutEnd();
    $manageCarEditInfoPopupFormInputs.Description.val("")
                                                 .attr("disabled", "disabled");
    $manageCarEditInfoPopupFormInputs.Confirm.attr("disabled", "disabled");
    manage_UpdateExistingJqueryObjects();
}
/* =========================== */