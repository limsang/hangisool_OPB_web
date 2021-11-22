<?php
    ini_set("session.cookie_secure", 1);
    ini_set("session.cookie_httponly", 1);
    ini_set("session.use_only_cookies", 1);

    session_cache_expire(720);
    session_start();
    if(!isset($_SESSION["logged_in"]) || $_SESSION["logged_in"] !== true) {
        header("Location: /login.php");
        exit();
    }
?>