<?php
    header("Content-Type: application/json; charset=UTF-8");

    include_once($_SERVER["DOCUMENT_ROOT"] . "/php-includes/_common.php");

    if($_SERVER["REQUEST_METHOD"] === "POST") {
        $account_index = trim($_POST["index"]);

        if(empty($account_index)) {
            exitWithJson_ResultMessagePair("empty", "계정 Index가 비어있습니다.");
        }

        if($result = $db->query("SELECT `hash`, `operator_index` FROM `cars`")) {
            $accessible_cars = array();

            while($row = $result->fetch_assoc()) {
                $splitted_index = explode(",", $row["operator_index"]);

                if(in_array($account_index, $splitted_index)) {
                    array_push($accessible_cars, $row["hash"]);
                }
            }

            exitWithJson_ResultMessagePair("success", json_encode($accessible_cars, JSON_UNESCAPED_UNICODE));
        } else {
            exitWithJson_ResultMessagePair("db_query_error", "DB 쿼리 실패.");
        }
    }
?>