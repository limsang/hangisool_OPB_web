<?php
    include_once($_SERVER["DOCUMENT_ROOT"] . "/php-includes/_common.php");
    
    if($_SESSION["is_el_cs_account"] == 1) {
        header("Location: /el-cs/");
        exit();
    }
    
    if(!isset($_GET["hash"]) || empty($_GET["hash"])) {
        exitWithAlert_RedirectAfter("Car 해시가 설정되어 있지 않습니다.", "/");
    }
    
    $car_information = array();

    if($statement = $db->prepare("SELECT `name`, `location`, `flag_emergency`, `operator_index`, `flag_calling`, `hash` FROM `cars` WHERE `hash`=?")) {
        $statement->bind_param("s", $_GET["hash"]);

        if($statement->execute()) {
            $statement->store_result();

            if($statement->num_rows() === 1) {
                $statement->bind_result($car_information["name"],
                                        $car_information["location"],
                                        $car_information["flag"],
                                        $car_information["operator_index"],
                                        $car_information["flag_calling"],
                                        $car_information["hash"]);

                if($statement->fetch()) {
                    $car_information["operator_index"] = explode(",", $car_information["operator_index"]);

                    if($_SESSION["is_company_admin"] != 1 && !in_array($_SESSION["operator_index"], $car_information["operator_index"])) {
                        exitWithAlert_RedirectAfter("이 Car와 영상통화를 할 수 있는 권한이 없습니다.", "/");
                    }

                    if(!isset($car_information["name"]) || empty($car_information["name"])
                        || !isset($car_information["location"]) || empty($car_information["location"])
                        || !isset($car_information["flag"]) || !isset($car_information["hash"])) {
                        exitWithAlert_RedirectAfter("오류가 발생하여 Car 정보를 DB로부터 가져오지 못했습니다. 다시 시도해 주세요.", "/");
                    }
                }
            } else {
                exitWithAlert_RedirectAfter("Car ID를 찾을 수 없거나 유일하지 않습니다.", "/");
            }
        } else {
            exitWithAlert_RedirectAfter("내부 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.", "/");
        }
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
        <title>통화 (<?= $car_information["name"] ?>) // <?= OEM_RESOURCE_INFO["name_ko"] ?> - <?= $_SESSION["company"] ?> <?= $_SESSION["field"] ?></title>

        <link href="/libs/normalize-8.0.1.min.css" rel="stylesheet">
        <link href="/libs/fonts/spoqa-han-sans/subset/spoqa-han-sans.css" rel="stylesheet">
        <link href="/libs/fonts/line-awesome/line-awesome.min.css" rel="stylesheet">
        <link href="/stylesheets/call.css" rel="stylesheet">
        <?php if(CONFIG_OEM_MODE) { $override_css_path = OEM_RESOURCE_INFO["override_css_path"]; echo("<link href='$override_css_path' rel='stylesheet'>"); } ?>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    </head>
    <body style="text-align: center; height: 100vh;">
        <noscript><h1>JavaScript가 비활성화되어 있습니다. 이 서비스는 JavaScript가 필수적으로 활성화되어야 합니다.</h1></noscript>
        
        <nav id="call_nav">
            <a id="topleft_gotoback_container" href="#">
                <span><i class="la la-arrow-left" aria-hidden="true"></i> <span>뒤로 가기</span></span>
            </a>
            <span>
                <span id="nav_car_name"><?= $car_information["name"] ?></span>
                <span id="nav_car_location"><i class="la la-map-marker" aria-hidden="true"></i> <?= $car_information["location"] ?></span>
            </span>
            <?php
                if($car_information["flag"] == 1) {
                    echo("<a id='topright_endemerg_container' href='#'>");
                        echo("<span><i class='la la-check-circle' aria-hidden='true'></i> <span>비상 상황 종료</span></span>");
                    echo("</a>");
                }
            ?>
        </nav>

        <video id="remote_video" autoplay playsinline></video>
        <video id="local_video" autoplay playsinline muted></video>

        <script>const CAR_HASH = "<?= $car_information["hash"] ?>";
                const WEBRTC_SIGNALING_ADDR = "<?= CONFIG_BACKEND_HOST ?>:<?= CONFIG_BACKEND_PORT ?>";</script>
        <script src="libs/socket.io.js"></script>
        <script src="res/js/call.js"></script>
    </body>
</html>