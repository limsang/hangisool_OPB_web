<?php
    header("Content-Type: application/json; charset=UTF-8");

    include_once($_SERVER["DOCUMENT_ROOT"] . "/php-includes/db.php");
    include_once($_SERVER["DOCUMENT_ROOT"] . "/php-includes/utility-functions.php");

    if($_SERVER["REQUEST_METHOD"] === "GET") {
        $hash = trim($_GET["hash"]);

        if(empty($hash)) {
            exitWithJson_ResultMessagePair("empty", "Car ID 값이 비어있습니다.");
        } else {
            if($statement = $db->prepare("SELECT `flag_emergency`, `flag_calling` FROM `cars` WHERE `hash`=?")) {
                $statement->bind_param("s", $hash);

                if($statement->execute()) {
                    $statement->store_result();

                    if($statement->num_rows() === 1) {
                        $statement->bind_result($result["emergency"], $result["calling"]);

                        if($statement->fetch()) {
                            if(isset($result["emergency"]) && isset($result["calling"])) {
                                exitWithJson_ResultMessagePair("success", json_encode($result));
                            } else {
                                exitWithJson_ResultMessagePair("result_invalid", "결과 데이터를 사용할 수 없습니다.");
                            }
                        } else {
                            exitWithJson_ResultMessagePair("db_fetch_error", "DB로부터 결과 데이터를 가져올 수 없습니다.");
                        }
                    } else {
                        exitWithJson_ResultMessagePair("affected_rows_not_one", "DB 오류. 가져온 열이 하나가 아닙니다.");
                    }
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