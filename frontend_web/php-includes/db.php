<?php
    include_once("_config.php");

    $db = new mysqli(CONFIG_DATABASE_HOST, CONFIG_DATABASE_ACCOUNT_ID, CONFIG_DATABASE_ACCOUNT_PW, CONFIG_DATABASE_DB_NAME);

    if($db->connect_error) {
        die("<h1>DB 연결 오류</h1>" .
            "<h3>원격 DB에 연결할 수 없거나, 연결 중 오류가 발생했습니다. 다음과 같은 경우에 연결 오류가 발생할 수 있습니다.</h3>" .
            "<ul>" .
                "<li>ECWS 서버에 인터넷 연결이 없는 경우</li>" .
                "<li>ECWS 서버에 인터넷 연결이 불안정한 경우</li>" .
                "<li>원격 DB 서버가 현재 점검 중인 경우</li>" .
                "<li>원격 DB 서버가 불안정하거나 인터넷 연결이 끊긴 경우</li>" .
            "</ul>" .
            "<h3>ECWS 서버에 문제가 없는 경우, 원격 DB 서버의 문제일 가능성이 있으니 아래 오류 내용과 함께 ㈜한기술에 문의 바랍니다.</h3>" .
            "<h2>[오류 코드 " . $db->connect_errno . "] " . $db->connect_error . "</h2>");
    }
?>