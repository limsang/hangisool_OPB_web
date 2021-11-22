<?php
    header("Content-Type: application/json; charset=UTF-8");

    include_once($_SERVER["DOCUMENT_ROOT"] . "/php-includes/db.php");
    include_once($_SERVER["DOCUMENT_ROOT"] . "/php-includes/utility-functions.php");

    if($_SERVER["REQUEST_METHOD"] === "POST") {
        $hash = trim($_POST["hash"]);
        $set_to = trim($_POST["set_to"]);
        $set_calling = trim($_POST["set_calling"]);

        if(empty($hash)) {
            exitWithJson_ResultMessagePair("empty", "Car 해시 값이 비어있습니다.");
        } else {
            $query = "UPDATE `cars` SET `flag_emergency`=?, `flag_calling`=? WHERE `hash`=?";
            if(!isset($_POST["set_to"])) { $query = "UPDATE `cars` SET `flag_calling`=? WHERE `hash`=?"; }

            if($statement = $db->prepare($query)) {
                if(!isset($_POST["set_to"])) $statement->bind_param("is", $set_calling, $hash);
                else $statement->bind_param("iis", $set_to, $set_calling, $hash);

                if($statement->execute()) {
                    exitWithJson_ResultMessagePair("success", "긴급 상황 플래그 업데이트 완료");
                } else {
                    exitWithJson_ResultMessagePair("internal_error", "내부 오류가 발생했습니다.");
                }
            } else {
                exitWithJson_ResultMessagePair("db_error", "DB 쿼리문이 잘못되었거나 기타 데이터베이스 오류가 발생했습니다.");
            }
        }
    } else {
        header("Location: /");
    }
?>