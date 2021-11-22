const COMPANY_PANEL_ADD_CAR_TAG = "__#ADD-CAR#__";
const COMPANY_PANEL_SEE_ALL_CAR_TAG = "__#SEE-ALL-CARS#__";

const ecwsLoginInfo = $("meta[name=ecwscslogininfo]").attr("content").split(",");
let   $companyItems = $("#panel_company #company_item_container .company_item");
let   $companyRealItems = $("#panel_company #company_item_container #company_item_content_container .company_item");
const $companySearchInput = $("#panel_company #company_search_container input");

$("#elcs_nav_logout_container").hover(function() {
    common_ShowToolTip($(this), `ID : ${ecwsLoginInfo[0]}<br>이름 : ${ecwsLoginInfo[1]}<br>E/L 업체 구분 : ${ecwsLoginInfo[2]}`);
}, function() {
    common_DismissToolTip($(this).find(".tooltip"));
});

$companyItems.click(function() {
    if($(this).data("name") !== COMPANY_PANEL_ADD_CAR_TAG) {
        $companyItems.filter(".active").removeClass("active");
        $(this).addClass("active");

        if($(this).data("name") === COMPANY_PANEL_SEE_ALL_CAR_TAG) {
            // See all car action
        } else {
            // Company specific action
        }
    } else {
        // Add car action
    }
});

$companySearchInput.on("input change", function() {
    const value = $(this).val().toString();

    $companyRealItems.each(function() {
        if(value.trim() === "") {
            $(this).css("display", "");
        } else {
            if($(this).find(".name").text().toLowerCase().indexOf(value.toLowerCase()) >= 0 ||
               $(this).find(".location").text().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                $(this).css("display", "");
            } else {
                $(this).css("display", "none");
            }
        }
    });
});