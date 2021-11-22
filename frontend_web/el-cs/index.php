<?php
    include_once($_SERVER["DOCUMENT_ROOT"] . "/php-includes/_common.php");

    if(!isset($_SESSION["is_el_cs_account"]) || $_SESSION["is_el_cs_account"] == 0) {
        header("Location: /");
        exit();
    }
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <meta name="robots" content="noindex, nofollow, noimageindex">
        <meta name="googlebot" content="noindex, nofollow, noimageindex">
        <meta name="theme-color" content="#212121">
        <meta name="ecwscslogininfo" content="<?= $_SESSION["id"] . "," . $_SESSION["name"] . "," . $_SESSION["el_company"] ?>">
        <title>ECWS E/L C/S</title>

        <link href="/libs/normalize-8.0.1.min.css" rel="stylesheet">
        <link href="/libs/fonts/spoqa-han-sans/subset/spoqa-han-sans.css" rel="stylesheet">
        <link href="/libs/fonts/line-awesome/line-awesome.min.css" rel="stylesheet">
        <link href="/stylesheets/el-cs.css" rel="stylesheet">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    </head>
    <body>
        <nav id="elcs_nav">
            <span id="elcs_nav_title"><strong>ECWS</strong> <text-thin><small>E/L 고객센터 전용 페이지</small></text-thin></span>
            <a id="elcs_nav_logout_container" href="/action/logout.php">
                <span>로그아웃</span>
                <i class="la la-sign-out" aria-hidden="true"></i>
            </a>
        </nav>

        <div id="elcs_body">
            <div id="panel_company" class="elcs_panel">
                <div class="panel_title_container">
                    <h1>관리 대상 현장(기업)</h1>
                    <h3>현장(기업)을 선택하면 할당 가능한 장치 및 현장(기업)에 등록된 계정이 표시됩니다.</h3>

                    <div id="company_search_container">
                        <i class="la la-search" aria-hidden="true"></i>
                        <input class="light" type="text" placeholder="현장(기업)명/지역 검색" />
                    </div>
                </div>
                <div id="company_item_container" class="panel_content">
                    <ul id="company_item_manage_container">
                        <li class="company_item active" data-name="__#SEE-ALL-CARS#__">
                            <div class="name"><i class="la la-eye" aria-hidden="true"></i> 모든 장치 보기</div>
                            <div class="location">할당 현장(기업)에 상관없이 모든 장치를 표시합니다.</div>
                        </li>
                        <li class="company_item" data-name="__#ADD-CAR#__">
                            <div class="name"><i class="la la-plus" aria-hidden="true"></i> 현장(기업) 추가</div>
                            <div class="location">여기를 눌러 현장(기업)을 추가하세요.</div>
                        </li>
                    </ul>
                    <hr />
                    <ul id="company_item_content_container">
                        <?php
                            $result = $db->query("SELECT `name`, `location` FROM `companies`");

                            if($result->num_rows > 0) {
                                while($row = $result->fetch_assoc()) {
                                    echo("<li class='company_item' data-name='" . $row["name"] . "'>");
                                        echo("<div class='name'>" . $row["name"] . "</div>");
                                        echo("<div class='location'>" . $row["location"] . "</div>");
                                    echo("</li>");
                                }
                            }

                            $result->free();
                            unset($result);
                        ?>
                    </ul>
                </div>
            </div>
            <div id="panels_manage">
                <div id="panel_cars" class="elcs_panel">
                    <?php
                        $result = $db->query("SELECT `name`, `location`, `field_name`, `el_company`, `hash`, `phone_number` FROM `cars` ORDER BY `field_name`");

                        $assigned_cars_html = "";
                        $unassigned_cars_html = "";

                        if($result->num_rows > 0) {
                            while($row = $result->fetch_assoc()) {
                                $car_html = "<div class='car_item' data-field-company='" . $row["field_name"] . "' data-hash='" . $row["hash"] . "' data-el-company='" . $row["el_company"] . "' data-location='" . $row["location"] . "' data-phone-number='" . $row["phone_number"] . "'>" .
                                                "<div class='car_short_info_container'>" .
                                                    "<div class='name'>" . $row["name"] . "</div>" .
                                                    "<span class='company'>" . $row["field_name"] . "</span> <span class='location'>" . $row["location"]. "</span>" .
                                                "</div>" .
                                                "<div class='car_manage_container'>" .
                                                    "<span>Manage</span>" .
                                                "</div>" .
                                            "</div>";

                                if($row["field_name"] == null) {
                                    $unassigned_cars_html .= $car_html;
                                } else {
                                    $assigned_cars_html .= $car_html;
                                }
                            }
                        }

                        $result->free();
                        unset($result);

                        if(!empty($unassigned_cars_html)) {
                            echo("<h1>할당되지 않은 장치</h1><div id='cars_unassigned_container'>");
                                echo($unassigned_cars_html);
                            echo("</div><hr />");
                        }

                        echo("<div id='cars_container'>");
                            echo($assigned_cars_html);
                        echo("</div>");

                        unset($assigned_cars_html, $unassigned_cars_html);
                    ?>
                </div>
                <div id="panel_account" class="elcs_panel">
                    <div class="panel_title_container">
                        <h1>계정 관리</h1>
                        <h3>현장(기업) 별로 계정을 만들거나 제거할 수 있고 관리자 계정을 설정할 수 있습니다.</h3>
                    </div>
                    <div class="elcs_panel_item_container"><!-- to be filled --></div>
                </div>
            </div>
        </div>

        <script src="/res/js/common.js"></script>
        <script src="el-cs.js"></script>
    </body>
</html>