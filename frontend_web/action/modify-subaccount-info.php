<?php
    header("Content-Type: application/json; charset=UTF-8");

    include_once($_SERVER["DOCUMENT_ROOT"] . "/php-includes/_common.php");

    if($_SERVER["REQUEST_METHOD"] === "POST") {
        $index = $_POST["index"];
        $name = $_POST["name"];
        // $company = $_POST["company"];
        $field = $_POST["field"];

        if(!isset($_POST["index"]) || !isset($_POST["name"]) || !isset($_POST["field"])) {
            exitWithJson_ResultMessagePair("empty", "필수 파라미터의 값이 비어있습니다.");
        } else {
            if($statement = $db->prepare("UPDATE `accounts` SET `name`=?, `field`=? WHERE `idx`=?" /* "UPDATE `accounts` SET `name`=?, `company`=?, `field`=? WHERE `idx`=?" */)) {
                $statement->bind_param("ssi" /* "sssi" */, $name, /* $company, */ $field, $index);

                if($statement->execute()) {
                    if($statement->affected_rows === 1) {
                        exitWithJson_ResultMessagePair("success", json_encode(array(
                            "name" => $name,
                            // "company" => $company,
                            "field" => $field
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