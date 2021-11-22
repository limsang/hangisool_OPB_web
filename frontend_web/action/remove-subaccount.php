<?php
    header("Content-Type: application/json; charset=UTF-8");

    include_once($_SERVER["DOCUMENT_ROOT"] . "/php-includes/_common.php");

    if($_SERVER["REQUEST_METHOD"] === "POST") {
        $index = $_POST["index"];

        if(empty($index)) {
            exitWithJson_ResultMessagePair("empty", "계정 Index 값이 비어있습니다.");
        } else {
            if($statement = $db->prepare("DELETE FROM `accounts` WHERE `idx`=?")) {
                $statement->bind_param("i", $index);

                if($statement->execute()) {
                    if($statement->affected_rows === 1) {
                        exitWithJson_ResultMessagePair("success", "계정 삭제 완료");
                    } else {
                        exitWithJson_ResultMessagePair("affected_rows_not_one", "변경된 열이 하나가 아닙니다. 해당 Index의 계정이 이미 삭제되었을 수도 있습니다.");
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