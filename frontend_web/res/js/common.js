$(function() {
    common_CheckLoginSessionPeriodically();     // Start checking login session periodically
});

function common_CheckLoginSessionPeriodically() {
    $.ajax({
        url: "/action/check-session.php"
    }).done(function(data) {
        if(data.logged_in == 0) {
            alert("로그인되어 있지 않습니다. 로그인 페이지로 이동합니다.");
            window.location.href = "/action/logout.php";
        }
    }).fail(function() {
        if(confirm("로그인 세션을 확인할 수 없습니다. (AJAX 실패)\n로그인 페이지로 이동하시겠습니까?")) {
            window.location.href = "/action/logout.php";
        }
    }).always(function() {
        setTimeout(function() {
            common_CheckLoginSessionPeriodically();
        }, 5000);
    });
}

function common_ShowToolTip(element, text) {
    // TODO: fix about z-index
    let $toolTipElement = $("<span class='tooltip'></span>");
    let left = $(element).offset().left + ($(element).width() / 2);
    let top = $(element).offset().top + $(element).outerHeight() - $(document).scrollTop();
    $toolTipElement.html(text);
    $toolTipElement.css("top", top + "px");

    $(element).append($toolTipElement);
    
    left -= $toolTipElement.width() / 2;
    $toolTipElement.css("left", left + "px");

    return $toolTipElement;
}

function common_DismissToolTip(toolTipElement) {
    $(toolTipElement).fadeOut(250, function() {
        $(toolTipElement).remove();
    });
}

function common_Blackout() {
    $("<div id='blackout'></div>").prependTo($("body"));

    setTimeout(function() {
        $("#blackout, html, body").addClass("blackout");
    }, 10);
}

function common_BlackoutEnd() {
    $("#blackout, html, body").removeClass("blackout");

    setTimeout(function() {
        $("#blackout").remove();
    }, 500);
}