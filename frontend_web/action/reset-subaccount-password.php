<?php
    header("Content-Type: application/json; charset=UTF-8");

    include_once($_SERVER["DOCUMENT_ROOT"] . "/php-includes/_common.php");

    if($_SERVER["REQUEST_METHOD"] === "POST") {
        $index = $_POST["index"];
        $password_hash = password_hash($_POST["password"], PASSWORD_BCRYPT);

        if(empty($index) || empty($_POST["password"])) {
            exitWithJson_ResultMessagePair("empty", "계정 Index 값 혹은 비밀번호 값이 비어있습니다.");
        } else {
            if($statement = $db->prepare("UPDATE `accounts` SET `pass_hash`=? WHERE `idx`=?")) {
                $statement->bind_param("si", $password_hash, $index);

                if($statement->execute()) {
                    if($statement->affected_rows === 1) {
                        exitWithJson_ResultMessagePair("success", "비밀번호 업데이트 완료");
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