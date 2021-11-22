<?php
    header("Content-Type: application/json; charset=UTF-8");

    include_once($_SERVER["DOCUMENT_ROOT"] . "/php-includes/_common.php");

    if($_SERVER["REQUEST_METHOD"] === "POST") {
        $hash = $_POST["hash"];
        $description = $_POST["description"];

        if(empty($hash) || empty($description)) {
            exitWithJson_ResultMessagePair("empty", "필수 파라미터의 값이 비어있습니다.");
        } else {
            if($statement = $db->prepare("UPDATE `cars` SET `description`=? WHERE `hash`=?")) {
                $statement->bind_param("ss", $description, $hash);

                if($statement->execute()) {
                    if($statement->affected_rows === 1) {
                        exitWithJson_ResultMessagePair("success", json_encode(array(
                            "description" => $description
                        )), JSON_UNESCAPED_UNICODE);
                    } else {
                        exitWithJson_ResultMessagePair("affected_rows_not_one", "변경된 열이 하나가 아닙니다.");
                    }
                } else {
                    exitWithJson_ResultMessagePair("db_execute_error", "DB 쿼리문을 실행할 수 없습니다.");
                }
            } else {
                exitWithJson_ResultMessagePair("db_query_error", "DB 쿼리문이 잘못되었습니다.");
            }
        }
    }
?>