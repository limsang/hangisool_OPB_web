<?php
    include_once($_SERVER["DOCUMENT_ROOT"] . "/php-includes/_common.php");

    if($_SESSION["is_el_cs_account"] == 1) {
        header("Location: /el-cs/");
        exit();
    }
?>

<!-- ECWS developed by Hangisool(Han Technology) -->
<!DOCTYPE html>
<html>
    <!-- HEAD -->
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <meta name="robots" content="noindex, nofollow, noimageindex">
        <meta name="googlebot" content="noindex, nofollow, noimageindex">
        <meta name="theme-color" content="#212121">
        <meta name="ecwsfieldinfo" content="<?= $_SESSION["company"] ?>">
        <title><?= OEM_RESOURCE_INFO["name_ko"] ?> ECWS - <?= $_SESSION["company"] ?> <?= $_SESSION["field"] ?></title>

        <link href="/libs/normalize-8.0.1.min.css" rel="stylesheet">
        <link href="/libs/fonts/spoqa-han-sans/subset/spoqa-han-sans.css" rel="stylesheet">
        <link href="/libs/fonts/line-awesome/line-awesome.min.css" rel="stylesheet">
        <link href="/stylesheets/index.css" rel="stylesheet">
        <?php if(CONFIG_OEM_MODE) { $override_css_path = OEM_RESOURCE_INFO["override_css_path"]; echo("<link href='$override_css_path' rel='stylesheet'>"); } ?>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    </head>

    <!-- BODY -->
    <body>
        <noscript><h1>JavaScript가 비활성화되어 있습니다. 이 서비스는 JavaScript가 필수적으로 활성화되어야 합니다.</h1></noscript>

        <!-- HEADER (LEFT SIDEBAR) -->
        <header id="header_main">
            <div id="header_place_container">
                <div id="header_place_contents">
                    <div id="header_place_image_container" style="background-image: url(res/demo/place_image.gif)">
                        <!-- LOGOUT BUTTON -->
                        <a id="header_place_image_logout_container" href="/action/logout.php">
                            <div>로그아웃</div>
                        </a>
                    </div>

                    <!-- LOGIN INFORMATION -->
                    <div id="header_logged_operator"><?= $_SESSION["name"] ?><?php if($_SESSION["is_company_admin"]) echo(" <sup><i class='la la-star' aria-hidden='true'></i></sup>"); ?></div>
                    <div id="header_place_name"><?= $_SESSION["company"] ?> <?= $_SESSION["field"] ?></div>
                </div>
            </div>

            <!-- NAVIGATION (SECTION LIST) -->
            <ul id="header_menus"><!--
             --><li data-anchor="dashboard"><i class="la la-inbox" aria-hidden="true"></i><span>대시보드</span></li><!--
             --><?php if($_SESSION["is_company_admin"] == 1) echo("<li data-anchor='manage'><i class='la la-gear' aria-hidden='true'></i><span>관리</span></li>"); ?><!--
             --><li data-anchor="settings"><i class="la la-sliders" aria-hidden="true"></i><span>설정</span></li><!--
             --><li data-anchor="help"><i class="la la-question" aria-hidden="true"></i><span>도움말</span></li><!--
             --><li data-anchor="contact"><i class="la la-users" aria-hidden="true"></i><span>ECWS 문의</span></li><!--
         --></ul>

            <!-- COPYRIGHT -->
            <div id="header_hangisool_ecws"><small>ⓒ</small> <a href="<?= OEM_RESOURCE_INFO["url"] ?>"><?= OEM_RESOURCE_INFO["name_en"] ?></a></div>
        </header>

        <!-- DASHBOARD SECTION -->
        <section id="section_dashboard" data-anchor="dashboard">
            <!-- DASHBOARD TOOLS -->
            <div id="dashboard_tools_container">
                <!-- CAR SEARCH -->
                <div id="dashboard_search_container" class="floating_item">
                    <i class="la la-search" aria-hidden="true"></i>
                    <input type="text" placeholder="전화번호/이름/장소 검색..." pattern=".+" required />
                </div>

                <!-- CAR ORDERING -->
                <div id="dashboard_order_container" class="floating_item">
                    <span style="font-weight: 500">이름 정렬</span>
                    <span class="order_name_asc active"><i class="la la-arrow-up icon" aria-hidden="true"></i> 오름차순</span>
                    <span class="order_name_desc"><i class="la la-arrow-down icon" aria-hidden="true"></i> 내림차순</span>
                </div>

                <!-- OPEN DASHBOARD TOOLS (ON MOBILE SCREEN) -->
                <div id="dashboard_mobile_tools_open_container">
                    <i class="la la-angle-down" aria-hidden="true"></i>
                </div>
            </div>
            
            <!-- ALL CAR STATUS -->
            <div id="dashboard_allstatus_container" class="floating_item">
                <i class="la la-refresh status_icon" aria-hidden="true"></i>
                <div class="description_container">
                    <!-- STATUS DESCRIPTIONS - WILL BE CHANGED BY SCRIPT IN REALTIME -->
                    <div class="description_main">통화 장치 상태 확인 중</div>
                    <div class="description_sub">등록된 모든 통화 장치의 상태를 확인하는 중입니다.</div>

                    <!-- ↓ TODO: implement count -->
                    <div class="description_status">총 <span class="total">??</span>개 중 <i class="la la-check" aria-hidden="true"></i> <span class="good">??</span>개 / <i class="la la-close" aria-hidden="true"></i> <span class="bad">??</span>개 / <i class="la la-warning" aria-hidden="true"></i> <span class="bad_device">??</span>개</div>
                </div>
            </div>

            <!-- EMERGENCY / NORMAL CAR CONTAINERS - WILL BE FILLED BY PHP/JS SCRIPT -->
            <div id="dashboard_emergency_devices_container"></div>
            <hr />
            <div id="dashboard_devices_container"><?php include_once("ui/dashboard-device-items.php"); ?></div>
        </section>

        <!-- CAR MANAGEMENT SECTION -->
        <?php if($_SESSION["is_company_admin"] == 1) include_once("ui/section-manage.php"); ?>

        <!-- SETTINGS SECTION -->
        <section id="section_settings" data-anchor="settings">
            <div id="settings_minimal_effect_container">
                <h1>효과 최소화</h1>
                <h3>그림자 효과나 전환 효과를 최소화합니다.<br />브라우저를 실행하고 있는 기기의 성능이 낮거나 장치 관리 대상이 너무 많아 느리게 작동한다면 먼저 이 설정을 사용해 보시기 바랍니다.</h3>
                <div>
                    <div><input type="checkbox" name="minimize_shadow" /><label for="minimize_shadow">그림자 효과 최소화</label></div>
                    <div><input type="checkbox" name="minimize_transition" /><label for="minimize_transition">전환 효과 최소화</label></div>
                </div>
            </div>
        </section>

        <!-- HELP SECTION -->
        <section id="section_help" data-anchor="help">
            <p>이 서비스는 Chrome을 기준으로 개발되었습니다.</p>
            <p>Firefox에서 영상통화 진행 후 통화 종료 시 브라우저의 버그가 발생합니다.</p>
            <p>IE와 Edge에서 레이아웃이 깨지거나 일부 스크립트가 작동하지 않을 수 있습니다.</p>

            <h1>단축키</h1>
            <h3>전역</h3>
            <ul>
                <li>D : 화면을 대시보드로 전환</li>
                <li>S : 화면을 설정으로 전환</li>
                <li>M (관리자 전용) : 화면을 관리로 전환</li>
                <li>H : 화면을 도움말로 전환</li>
                <li>C : 화면을 연락으로 전환</li>
            </ul>
            <h3>대시보드</h3>
            <ul>
                <li>A : 검색 상자 포커스</li>
                <li>1 ~ 9 : 입력한 수 n번째의 비상 장치로 영상 통화 시작</li>
            </ul>
        </section>

        <!-- CONTACT SECTION -->
        <section id="section_contact" data-anchor="contact">
            <p>연락처(Contact) 페이지입니다.</p>
        </section>

        <!-- BACKGROUND LOGO DECORATION -->
        <img id="index_oem_logo" src="<?= OEM_RESOURCE_INFO["logo_image_path"] ?>" />

        <!-- SCRIPTS -->
        <script>const EMERGENCY_FLAG_IO_ADDR = "<?= CONFIG_BACKEND_HOST ?>:<?= CONFIG_BACKEND_EMERGENCY_FLAG_QUERY_PORT ?>";</script>
        <script src="/libs/js.cookie-2.2.0.min.js"></script>
        <script src="libs/socket.io.js"></script>
        <script src="res/js/common.js"></script>
        <script src="res/js/index.js"></script>
    </body>
</html>