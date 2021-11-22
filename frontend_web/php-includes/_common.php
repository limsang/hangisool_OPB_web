<?php
    set_include_path(get_include_path() . ":" . $_SERVER["DOCUMENT_ROOT"] . "/php-includes");

    header("Access-Control-Allow-Origin: *");
    
    include_once("_config.php");
    include_once("start-session-and-check-login.php");
    include_once("db.php");
    include_once("utility-functions.php");
?>