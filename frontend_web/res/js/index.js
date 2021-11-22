'use strict';

$(function() { window.focus(); $("input").attr("tabindex", "-1"); });

/* ===   Notice in console   === */
console.info("******************************************\n"   +
             "*               E  C  W  S               *\n"   +
             "*     ~ Emergency Call Web Service ~     *\n"   +
             "*                                        *\n"   +
             "*            Developed by Han Technology *\n"   +
             "*                       a.k.a. Hangisool *\n"   +
             "******************************************\n\n" +
             "  All of source codes belong to           \n"   +
             " Han Technology(Hangisool).               \n"   +
             "  DO NOT MODIFY CODES OR YOU WILL LOSE    \n"   +
             " YOUR WARRANTY.                           \n"   +
             "  DO NOT DISTRIBUTE THIS WEB SERVICE.     \n"   +
             " UNAUTHORIZED DISTRIBUTION IS STRICTLY    \n"   +
             " PROHIBITED. IF YOU DO IT, YOU WILL BE    \n"   +
             " ENFORCED BY LAW.                         \n"   +
             "  If you need some features and bugfixes  \n"   +
             " which requires code modification, please \n"   +
             " contact to Han Technology.               \n\n" +
             "  이 서비스의 모든 소스 코드는            \n"   +
             " ㈜한기술이 저작 및 보유함.               \n"   +
             "  코드를 무단으로 수정하지 마십시오.      \n"   +
             " 기술 지원을 포함한 모든 지원 보증을      \n"   +
             " 상실할 가능성이 있습니다.                \n"   +
             "  이 서비스를 무단으로 배포하지 마십시오. \n"   +
             " 비허가된 배포는 절대 금지하고 있습니다.  \n"   +
             " 이를 어길 경우, 법적 조치를 취하겠습니다.\n"   +
             "  코드 변경이 필요한 기능이나 버그 수정이 \n"   +
             " 필요한 경우, ㈜한기술에 연락을           \n"   +
             " 취해주시기 바랍니다.                     \n\n" +
             "  このサービスの全てのソースコードは、    \n"   +
             " Han Technologyが著作・保有します。       \n"   +
             "  ソースコードを無断で修正しないで        \n"   +
             " ください。 技術サポートを含める全ての    \n"   +
             " サポートワランティが喪失されることが     \n"   +
             " あります。                               \n"   +
             "  このサービスを無断で配布しないで        \n"   +
             " ください。　不許可の配布は絶対禁止です。 \n"   +
             " これに違反した場合、法的措置をとります。 \n"   +
             "  機能の追加やバグ直しなど、ソースコードの\n"   +
             " 変更が必要な場合、Han Technologyに       \n"   +
             " ご連絡ください。                         \n");
/* ============================= */

/* ===       Constants       === */
const DEVICE_STATUS_CLASS_PENDING_UPDATE_VIEW = "pending_update";
const DEVICE_STATUS_CLASS_GOOD                = "good";
const DEVICE_STATUS_CLASS_EMERGENCY           = "bad";
const DEVICE_STATUS_CLASS_BAD_DEVICE          = "bad_device";
const DEVICE_STATUS_CLASS_CALLING             = "calling";
const DEVICE_STATUS_CLASS_ALL                 = `${DEVICE_STATUS_CLASS_GOOD} ${DEVICE_STATUS_CLASS_EMERGENCY} ${DEVICE_STATUS_CLASS_BAD_DEVICE} ${DEVICE_STATUS_CLASS_CALLING}`;

const DEVICE_STATUS_LA_ICON_GOOD              = "la-check";
const DEVICE_STATUS_LA_ICON_EMERGENCY         = "la-warning";
const DEVICE_STATUS_LA_ICON_BAD_DEVICE        = DEVICE_STATUS_LA_ICON_EMERGENCY;
const DEVICE_STATUS_LA_ICON_CALLING           = "la-phone";

const ALL_STATUS_CONTAINER_CLASS_GOOD         = "good";
const ALL_STATUS_CONTAINER_CLASS_BAD          = "bad";
const ALL_STATUS_CONTAINER_CLASS_ALL          = `${ALL_STATUS_CONTAINER_CLASS_GOOD} ${ALL_STATUS_CONTAINER_CLASS_BAD}`;

const ALL_STATUS_CONTAINER_LA_ICON_GOOD       = "la-check";
const ALL_STATUS_CONTAINER_LA_ICON_BAD        = "la-warning";
const ALL_STATUS_CONTAINER_LA_ICON_NO_PERM    = "la-close";
/* ============================= */

/* ===  DOM-jQuery  Objects  === */
const $headerContainer                        = $("header#header_main");
const $headerLogoutContainer                  = $headerContainer.find("#header_place_image_logout_container");
const $headerMenus                            = $headerContainer.find("#header_menus");
const $headerMenuItems                        = $headerMenus.find("li");

const $dashboardSection                       = $("section#section_dashboard");
const $dashboardSearchInput                   = $dashboardSection.find("#dashboard_search_container input[type=text]");
const $dashboardEmergencyDevicesContainer     = $dashboardSection.find("#dashboard_emergency_devices_container");
const $dashboardNormalDevicesContainer        = $dashboardSection.find("#dashboard_devices_container");
const $dashboardAllStatusContainer            = $dashboardSection.find("#dashboard_allstatus_container");
const $dashboardDeviceItems                   = $dashboardSection.find(".device_item");

const $dashboardDeviceLocationContainer       = $dashboardSection.find("#dashboard_devices_location_container");
const $dashboardDeviceLocationItems           = $dashboardDeviceLocationContainer.find(".location_item");
const $dashboardDeviceLocationSeeAllItem      = $dashboardDeviceLocationItems.filter(".see_all[data-location='##see_all##']");

const $dashboardToolsContainer                = $dashboardSection.find("#dashboard_tools_container");
const $dashboardOrderContainer                = $dashboardToolsContainer.find("#dashboard_order_container");
const $dashboardOrderByNameAsc                = $dashboardOrderContainer.find(".order_name_asc")
const $dashboardOrderByNameDesc               = $dashboardOrderContainer.find(".order_name_desc");
const $dashboardToolsMobileOpenContainer      = $dashboardToolsContainer.find("#dashboard_mobile_tools_open_container");

const $settingsSection                        = $("section#section_settings");
const $settingsMinimalEffectContainer         = $settingsSection.find("#settings_minimal_effect_container");
const $settingsMinimalEffectShadowCheckBox    = $settingsMinimalEffectContainer.find("input[name=minimize_shadow]");
const $settingsMinimalEffectTransCheckBox     = $settingsMinimalEffectContainer.find("input[name=minimize_transition]");
/* ============================= */

/* === Socket.IO  flag query === */
const socket                                  = io.connect(EMERGENCY_FLAG_IO_ADDR, {
    secure:               true,
    reconnection:         true,
    reconnectionDelay:    750,
    reconnectionDelayMax: 2500,
    autoConnect:          true,
    timeout:              10000,
    query:                {
        field_name: $("meta[name=ecwsfieldinfo]").attr("content")
    }
});
let   socketDisconnectedByClient              = false;

socket.on("flagData", dashboard_UpdateCarFlagInfoByFlagData);
socket.on("result", (data) => {
    if(typeof(data) !== "undefined" && data != null) {
        if(data.type === "carFlag" || data.type === "carFlagAll") {
            dashboard_UpdateCarFlagInfoByFlagData(data.data);
        }
    }
});
socket.on("disconnect", (reason) => {
    if(!socketDisconnectedByClient) {
        $dashboardDeviceItems.removeClass(DEVICE_STATUS_CLASS_ALL).addClass(DEVICE_STATUS_CLASS_BAD_DEVICE).addClass(DEVICE_STATUS_CLASS_PENDING_UPDATE_VIEW);
        dashboard_UpdateCarsView();
    
        if(reason === "io server disconnect") {
            alert("긴급 신호 조회 서버에 연결할 수 없습니다. 서버 측에서 연결을 끊었습니다.");
        } else if(reason === "ping timeout") {
            alert("긴급 신호 조회 서버에 연결할 수 없습니다. 서버가 응답하지 않습니다.");
        } else if(reason === "io client disconnect") {
            alert("긴급 신호 조회 서버와의 연결이 종료되었습니다.");
        }
    } else {
        socket.connect();
    }
});
socket.on("connect_error", () => {
    $dashboardDeviceItems.removeClass(DEVICE_STATUS_CLASS_ALL).addClass(DEVICE_STATUS_CLASS_BAD_DEVICE).addClass(DEVICE_STATUS_CLASS_PENDING_UPDATE_VIEW);
    dashboard_UpdateCarsView();

    if(socket.disconnected) { socket.connect(); }
});
socket.on("connect", () => { socket.emit("getFlagAll"); });

$(window).on("beforeunload unload", function() {
    socket.disconnect();
    socketDisconnectedByClient = true;
});

setInterval(function() {
    if(!socketDisconnectedByClient && socket.disconnected) {
        console.debug("Socket.io connection lost detected; trying to connect again");
        socket.connect();
    }
}, 3000);
/* ============================= */

/* ===      Event Setup      === */
$(document).ready(index_DocumentReadyCallback);
$(window).on("hashchange", index_SwitchSectionByAnchor);
$headerMenuItems.click(function() { headerMenus_ChangeActive($(this)); });
$headerLogoutContainer.click(function(e) {
    e.preventDefault();

    if(confirm("로그아웃 하시겠습니까?")) {
        window.location.href = $(this).attr("href");
    }

    return false;
});
$dashboardSearchInput.on("input change", function() { dashboard_UpdateSearchResult($(this).val().replace(/-/g, "")); });
$dashboardDeviceItems.click(dashboard_DeviceItemClickCallback);
$dashboardDeviceLocationItems.click(dashboard_DeviceLocationItemClickCallback);
$dashboardOrderByNameAsc.click(function() { dashboard_OrderDevicesItemsByName(false); });
$dashboardOrderByNameDesc.click(function() { dashboard_OrderDevicesItemsByName(true); });
$dashboardToolsMobileOpenContainer.click(dashboard_ShowToolsMobileCallback);

$settingsMinimalEffectShadowCheckBox.change(function() { settings_minimalEffectSettingsCallback("disable_shadow", $(this).is(":checked")); });
$settingsMinimalEffectTransCheckBox.change(function() { settings_minimalEffectSettingsCallback("disable_transition", $(this).is(":checked")); });

// ↓ Keyboard shortcut
document.addEventListener("keypress", (event) => {
    let $activeElement = $(document.activeElement);

    if(!($activeElement.is("input[type=text]") ||
         $activeElement.is("input[type=password]"))) {
        switch(event.key.toLowerCase()) {
            // ↓ Global index page shortcuts
            case "d": {
                headerMenus_ChangeActive($headerMenuItems.filter("li[data-anchor=dashboard]"));
                break;
            }
            case "m": {
                headerMenus_ChangeActive($headerMenuItems.filter("li[data-anchor=manage]"));
                break;
            }
            case "s": {
                headerMenus_ChangeActive($headerMenuItems.filter("li[data-anchor=settings]"));
                break;
            }
            case "h": {
                headerMenus_ChangeActive($headerMenuItems.filter("li[data-anchor=help]"));
                break;
            }
            case "c": {
                headerMenus_ChangeActive($headerMenuItems.filter("li[data-anchor=contact]"));
                break;
            }

            // ↓ Dashboard shortcuts
            case "a": {
                if(sections_GetCurrentSectionAnchorName() === "dashboard") {
                    $dashboardSearchInput.focus();
                    event.preventDefault();
                }
                break;
            }
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9": {
                if((sections_GetCurrentSectionAnchorName() === "dashboard") && ($dashboardEmergencyDevicesContainer.find(".device_item").length >= parseInt(event.key.toLowerCase()))) {
                    $dashboardEmergencyDevicesContainer.find(".device_item")[parseInt(event.key.toLowerCase()) - 1].click();
                }
                break;
            }
        }
    }
});
/* ============================= */

/* ===  Set-up on page load  === */
$(function() {
    $settingsMinimalEffectShadowCheckBox.attr("checked", settings_GetCookie("effect_disable_shadow")).change();
    $settingsMinimalEffectTransCheckBox.attr("checked", settings_GetCookie("effect_disable_transition")).change();
});
/* ============================= */

/* === Functions & Callbacks === */
function index_DocumentReadyCallback() {
    index_SwitchSectionByAnchor();        // Switch active section by URL hash(anchor)

    if($dashboardDeviceItems.length <= 0) {
        dashboard_UpdateAllStatusBox();
    }
}

function index_SwitchSectionByAnchor() {
    if(window.location.hash.length > 0) {
        headerMenus_ChangeActive($headerMenus.find(`li[data-anchor=${window.location.hash.substr(1)}]`));
    } else {
        headerMenus_ChangeActive($headerMenuItems.first());
    }
}

function headerMenus_ChangeActive(menuElement) {
    if(typeof(menuElement) !== "undefined" && menuElement != null && menuElement.length === 1) {
        $headerMenus.find("li.active").removeClass("active");
        $(menuElement).addClass("active");
        window.history.replaceState(undefined, undefined, "#" + $(menuElement).data("anchor"));

        sections_ChangeCurrent($(`section[data-anchor=${$(menuElement).data("anchor")}]`));
    }
}

function sections_ChangeCurrent(sectionElement) {
    $("section.current").removeClass("current");
    $(sectionElement).addClass("current");
}

function sections_GetCurrentSectionAnchorName() {
    return $("section.current").data("anchor");
}

function dashboard_UpdateSearchResult(search) {
    $dashboardDeviceItems.each(function() {
        if(search.trim() === "") {
            $(this).css("display", "");
        } else {
            if($(this).find(".phone_number").text().replace(/-/g, "").indexOf(search) >= 0 ||
               $(this).find(".name").text().toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
               $(this).find(".location").text().toLowerCase().indexOf(search.toLowerCase()) >= 0) {
                $(this).css("display", "");
            } else {
                $(this).css("display", "none");
            }
        }
    });
}

function dashboard_DeviceItemClickCallback() {
    if(!$(this).hasClass(DEVICE_STATUS_CLASS_CALLING)) {
        let $this = $(this);

        const callCar = () => {
            $.ajax({
                method: "POST",
                url: "/action/set-car-emergency-flag.php",
                data: {
                    hash: $this.data("hash"),
                    set_calling: 1
                }
            }).done(function(data) {
                if(data.result === "success") {
                    window.location.href = `/call.php?hash=${$this.data("hash")}`;
                } else {
                    alert("통화 상태를 업데이트 할 수 없습니다. " + data.message);
                    window.location.href = "/";
                }
            }).fail(function() {
                alert("통화 상태를 업데이트 할 수 없습니다. (AJAX 실패)");
                window.location.href = "/";
            });
        };

        if($(this).hasClass(DEVICE_STATUS_CLASS_GOOD)) {
            if(confirm("현재 선택한 장치로부터 긴급 통화 요청이 없습니다. 영상통화는 가급적 긴급 상황 발생 시에만 사용해 주세요. 계속 하시겠습니까?")) {
                callCar();
            } else {
                return false;
            }
        } else if($(this).hasClass(DEVICE_STATUS_CLASS_BAD_DEVICE)) {
            alert("현재 기기에 문제가 발생했습니다. 영상통화를 사용할 수 없습니다.");
            return false;
        } else if($(this).hasClass(DEVICE_STATUS_CLASS_EMERGENCY)) {
            callCar();
        }
    } else {
        alert("현재 다른 담당자가 통화 중입니다.");
        return false;
    }
}

function dashboard_DeviceLocationItemClickCallback() {
    if($(this).is($dashboardDeviceLocationSeeAllItem)) {
        $dashboardDeviceLocationItems.removeClass("active");
        $(this).addClass("active");
    } else {
        $dashboardDeviceLocationSeeAllItem.removeClass("active");
        
        if($(this).hasClass("active")) {
            $(this).removeClass("active");

            if($dashboardDeviceLocationItems.filter(".active").length <= 0) {
                $dashboardDeviceLocationSeeAllItem.addClass("active");
            }
        } else {
            $(this).addClass("active");

            if($dashboardDeviceLocationItems.filter(".active").length == $dashboardDeviceLocationItems.length - 1) {
                $dashboardDeviceLocationItems.removeClass("active");
                $dashboardDeviceLocationSeeAllItem.addClass("active");
            }
        }
    }

    let locations = $dashboardDeviceLocationItems.filter(".active").map((_, e) => $(e).data("location").toString()).toArray();
    dashboard_ShowDevicesByLocation(locations);
}

function dashboard_ShowDevicesByLocation(locations) {
    if($dashboardDeviceLocationSeeAllItem.hasClass("active") && locations[0] === "##see_all##") {
        $dashboardDeviceItems.css("display", "");
    } else {
        $dashboardDeviceItems.css("display", "none");

        locations.forEach(e => {
            $dashboardDeviceItems.filter(`[data-location=${e}]`).css("display", "");
        });
    }
}

function dashboard_UpdateCarFlagInfoByFlagData(flagData) {
    for(let index in Object.keys(flagData)) {
        let $itemElement = $dashboardDeviceItems.filter(`[data-hash=${Object.keys(flagData)[index]}]`);
        let emergencyFlag = flagData[Object.keys(flagData)[index]].emergency;
        let callingFlag = flagData[Object.keys(flagData)[index]].calling;

        if($itemElement.length === 1) {
            if(emergencyFlag == 0 && !$itemElement.hasClass(DEVICE_STATUS_CLASS_GOOD)) {
                $itemElement.removeClass(DEVICE_STATUS_CLASS_ALL.replace(DEVICE_STATUS_CLASS_CALLING, "")).addClass(DEVICE_STATUS_CLASS_GOOD).addClass(DEVICE_STATUS_CLASS_PENDING_UPDATE_VIEW);
            } else if(emergencyFlag == 1 && !$itemElement.hasClass(DEVICE_STATUS_CLASS_EMERGENCY)) {
                $itemElement.removeClass(DEVICE_STATUS_CLASS_ALL.replace(DEVICE_STATUS_CLASS_CALLING, "")).addClass(DEVICE_STATUS_CLASS_EMERGENCY).addClass(DEVICE_STATUS_CLASS_PENDING_UPDATE_VIEW);
            }
    
            if(callingFlag == 1 && !$itemElement.hasClass(DEVICE_STATUS_CLASS_CALLING)) {
                $itemElement.addClass(DEVICE_STATUS_CLASS_CALLING).addClass(DEVICE_STATUS_CLASS_PENDING_UPDATE_VIEW);
            } else if(callingFlag == 0 && $itemElement.hasClass(DEVICE_STATUS_CLASS_CALLING)) {
                $itemElement.removeClass(DEVICE_STATUS_CLASS_CALLING).addClass(DEVICE_STATUS_CLASS_PENDING_UPDATE_VIEW);
            }
        }
    }

    dashboard_UpdateCarsView();
}                                                                                                                                                                                        

function dashboard_UpdateCarsView() {
    $dashboardDeviceItems.filter(`.${DEVICE_STATUS_CLASS_PENDING_UPDATE_VIEW}`).each(function(_, element) {
        $(element).removeClass(DEVICE_STATUS_CLASS_PENDING_UPDATE_VIEW);

        let $itemElementStatusIcon = $(element).find(".status i");
        let $itemElementStatusText = $(element).find(".status span");

        if($(element).hasClass(DEVICE_STATUS_CLASS_GOOD)) {
            $itemElementStatusIcon.attr("class", `la ${DEVICE_STATUS_LA_ICON_GOOD}`);
            $itemElementStatusText.text("정상");
        } else if($(element).hasClass(DEVICE_STATUS_CLASS_EMERGENCY)) {
            $itemElementStatusIcon.attr("class", `la ${DEVICE_STATUS_LA_ICON_EMERGENCY}`);
            $itemElementStatusText.text("통화 요청");
        } else if($(element).hasClass(DEVICE_STATUS_CLASS_BAD_DEVICE)) {
            $itemElementStatusIcon.attr("class", `la ${DEVICE_STATUS_LA_ICON_BAD_DEVICE}`);
            $itemElementStatusText.text("이상 발생 (서버 연결 불가)");
        }

        if($(element).hasClass(DEVICE_STATUS_CLASS_CALLING)) {
            $itemElementStatusIcon.attr("class", `la ${DEVICE_STATUS_LA_ICON_CALLING}`);
            $itemElementStatusText.text("통화 중");
        }

        dashboard_RearrangeDeviceItem(element);
    });
}

function dashboard_RearrangeDeviceItem(itemElement) {
    if(($(itemElement).hasClass(DEVICE_STATUS_CLASS_EMERGENCY)  && $(itemElement).parent().is($dashboardNormalDevicesContainer)) ||
       ($(itemElement).hasClass(DEVICE_STATUS_CLASS_BAD_DEVICE) && $(itemElement).parent().is($dashboardNormalDevicesContainer)) ||
       ($(itemElement).hasClass(DEVICE_STATUS_CLASS_GOOD)       && $(itemElement).parent().is($dashboardEmergencyDevicesContainer))) {
        $(itemElement).addClass("scale_out");

        setTimeout(function() {
            if($(itemElement).hasClass(DEVICE_STATUS_CLASS_EMERGENCY)) {
                $(itemElement).prependTo($dashboardEmergencyDevicesContainer);
            } else if($(itemElement).hasClass(DEVICE_STATUS_CLASS_BAD_DEVICE)) {
                $(itemElement).appendTo($dashboardEmergencyDevicesContainer);
            } else if($(itemElement).hasClass(DEVICE_STATUS_CLASS_GOOD)) {
                $(itemElement).appendTo($dashboardNormalDevicesContainer);
            }

            dashboard_UpdateAllStatusBox();

            setTimeout(function() {
                $(itemElement).addClass("scale_in");

                setTimeout(function() {
                    $(itemElement).removeClass("scale_out scale_in");
                }, 250);
            }, 20);
        }, 250);
    } else {
        dashboard_UpdateAllStatusBox();
    }
}

function dashboard_UpdateAllStatusBox() {
    if($dashboardEmergencyDevicesContainer.children().length > 0) {
        $dashboardAllStatusContainer.removeClass(ALL_STATUS_CONTAINER_CLASS_ALL).addClass(ALL_STATUS_CONTAINER_CLASS_BAD);
        $dashboardAllStatusContainer.find("i.status_icon").attr("class", `la ${ALL_STATUS_CONTAINER_LA_ICON_BAD} status_icon`);

        if($dashboardEmergencyDevicesContainer.find(`.${DEVICE_STATUS_CLASS_EMERGENCY}`).length > 0) {
            $dashboardAllStatusContainer.find(".description_main").text("긴급 통화 요청 중");

            if($dashboardEmergencyDevicesContainer.find(`.${DEVICE_STATUS_CLASS_BAD_DEVICE}`).length > 0) {
                $dashboardAllStatusContainer.find(".description_sub").text("일부 통화 장치에 이상이 발생했습니다.");
            } else {
                $dashboardAllStatusContainer.find(".description_sub").text("모든 통화 장치가 정상적으로 작동 중입니다.");
            }
        } else if(($dashboardEmergencyDevicesContainer.find(`.${DEVICE_STATUS_CLASS_BAD_DEVICE}`).length > 0) &&
                  ($dashboardEmergencyDevicesContainer.find(`.${DEVICE_STATUS_CLASS_EMERGENCY}`).length <= 0)) {
            $dashboardAllStatusContainer.find(".description_main").text("일부 통화 장치에 이상 발생");
            $dashboardAllStatusContainer.find(".description_sub").text("긴급 통화 요청이 없습니다.");
        }

        return;
    } else if($dashboardDeviceItems.length <= 0) {
        $dashboardAllStatusContainer.removeClass(ALL_STATUS_CONTAINER_CLASS_ALL).addClass(ALL_STATUS_CONTAINER_CLASS_BAD);
        $dashboardAllStatusContainer.find("i.status_icon").attr("class", `la ${ALL_STATUS_CONTAINER_LA_ICON_NO_PERM} status_icon`);
        $dashboardAllStatusContainer.find(".description_main").text("장치 접근 권한 없음");
        $dashboardAllStatusContainer.find(".description_sub").text("이 계정으로 접근할 수 있는 장치가 없습니다. 담당자에게 접근 권한을 요청하시기 바랍니다.");

        return;
    } else {
        $dashboardAllStatusContainer.removeClass(ALL_STATUS_CONTAINER_CLASS_ALL).addClass(ALL_STATUS_CONTAINER_CLASS_GOOD);
        $dashboardAllStatusContainer.find("i.status_icon").attr("class", `la ${ALL_STATUS_CONTAINER_LA_ICON_GOOD} status_icon`);
        $dashboardAllStatusContainer.find(".description_main").text("긴급 통화 요청 없음");
        $dashboardAllStatusContainer.find(".description_sub").text("모든 통화 장치가 정상적으로 작동 중입니다.");
        
        return;
    }
}

function dashboard_OrderDevicesItemsByName(isDescending = false) {
    // EMERGENCY DEVICES WILL NOT BE ORDERED
    
    if(!((isDescending && $dashboardOrderByNameDesc.hasClass("active")) ||
       (!isDescending && $dashboardOrderByNameAsc.hasClass("active")))) {
        let $orderedNormalDevs = $dashboardNormalDevicesContainer.find(".device_item").sort(function(a, b) {
            return $(a).find(`.name`).text().localeCompare($(b).find(`.name`).text());
        });
    
        if(isDescending) {
            $orderedNormalDevs = $($orderedNormalDevs.get().reverse());
    
            $dashboardOrderByNameAsc.removeClass("active");
            $dashboardOrderByNameDesc.addClass("active");
        } else {
            $dashboardOrderByNameDesc.removeClass("active");
            $dashboardOrderByNameAsc.addClass("active");
        }
    
        $orderedNormalDevs.appendTo($dashboardNormalDevicesContainer);
    }
}

function dashboard_ShowToolsMobileCallback() {
    $dashboardToolsContainer.toggleClass("active");

    if($dashboardToolsContainer.hasClass("active")) {
        $dashboardToolsMobileOpenContainer.find("i").removeClass("la-angle-down").addClass("la-angle-up");
    } else {
        $dashboardToolsMobileOpenContainer.find("i").removeClass("la-angle-up").addClass("la-angle-down");
    }
}

function settings_minimalEffectSettingsCallback(settingName, checked) {
    if(checked) {
        $("html").addClass(settingName);
    } else {
        $("html").removeClass(settingName);
    }

    settings_SetCookie(`effect_${settingName}`, checked);
}

function settings_SetCookie(settingName, settingVal) {
    if(typeof(Cookies.getJSON("ECWS_SETTINGS")) === "undefined") {
        Cookies.set("ECWS_SETTINGS", {});
    }

    let settings = Cookies.getJSON("ECWS_SETTINGS");
    settings[settingName] = settingVal;

    Cookies.set("ECWS_SETTINGS", settings);
}

function settings_GetCookie(settingName, defaultValue = undefined) {
    let settings = Cookies.getJSON("ECWS_SETTINGS");
    
    if(typeof(settings) !== "undefined") {
        return settings[settingName];
    } else {
        return defaultValue;
    }
}
