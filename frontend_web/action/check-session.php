<?php
    header("Content-Type: application/json; charset=UTF-8");

    session_start();
    if(isset($_SESSION["logged_in"]) && $_SESSION["logged_in"] === true
        && isset($_SESSION["session_ip"]) && $_SESSION["session_ip"] === $_SERVER["REMOTE_ADDR"]) {
        echo(json_encode(array(
            "logged_in" => 1
        )));
    } else {
        echo(json_encode(array(
            "logged_in" => 0
        )));
    }
    exit();
?>