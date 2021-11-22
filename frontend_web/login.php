<?php
    include_once($_SERVER["DOCUMENT_ROOT"] . "/php-includes/_config.php");
    include_once($_SERVER["DOCUMENT_ROOT"] . "/php-includes/db.php");       // DB check

    session_start();
    if(isset($_SESSION["logged_in"]) && $_SESSION["logged_in"] === true) {
        if($_SESSION["is_el_cs_account"] == 1) {
            header("Location: /el-cs/");
        } else {
            header("Location: /");
        }
        
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
        <title>LOGIN // <?= OEM_RESOURCE_INFO["name_ko"] ?> ECWS</title>

        <link href="/libs/normalize-8.0.1.min.css" rel="stylesheet">
        <link href="/libs/fonts/spoqa-han-sans/subset/spoqa-han-sans.css" rel="stylesheet">
        <link href="/libs/fonts/line-awesome/line-awesome.min.css" rel="stylesheet">
        <link href="/stylesheets/login.css" rel="stylesheet">
        <?php if(CONFIG_OEM_MODE) { $override_css_path = OEM_RESOURCE_INFO["override_css_path"]; echo("<link href='$override_css_path' rel='stylesheet'>"); } ?>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    </head>
    <body>
        <noscript><h1>JavaScript가 비활성화되어 있습니다. 이 서비스는 JavaScript가 필수적으로 활성화되어야 합니다.</h1></noscript>
        
        <section id="section_login">
            <div id="title_container">
                <div>
                    <div style="font-size: 1.33rem; font-weight: 100;">긴급·비상 영상통화 웹 서비스</div>
                    <div class="title"><span style="font-weight: 300"><?= OEM_RESOURCE_INFO["name_ko"] ?></span> ECWS</div>
                    <div class="login">로그인</div>
                </div>
            </div>
            <div id="form_container">
                <form>
                    <div><label for="id">ID </label> <input type="text" name="id" required maxlength="32" autofocus pattern="[A-Za-z0-9_]+" /></div>
                    <div><label for="password">비밀번호 </label> <input type="password" name="password" required /></div>
                    <div style="font-size: 1.25rem">※ ID/PW 발급은 담당자에게 문의 바랍니다.</div>
                    <div id="form_error_container"></div>
                    <input id="form_submit_button" type="button" value="로그인" disabled />
                </form>
            </div>
        </section>

        <footer id="login_footer">ⓒ <a href="<?= OEM_RESOURCE_INFO["url"] ?>"><?= OEM_RESOURCE_INFO["name_en"] ?></a></footer>

        <script src="res/js/login.js"></script>
    </body>
</html>