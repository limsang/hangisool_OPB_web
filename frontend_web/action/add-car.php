<?php
    header("Content-Type: application/json; charset=UTF-8");

    include_once($_SERVER["DOCUMENT_ROOT"] . "/php-includes/db.php");
    include_once($_SERVER["DOCUMENT_ROOT"] . "/php-includes/utility-functions.php");

    if($_SERVER["REQUEST_METHOD"] === "POST") {
        // 일반 POST 데이터 (urlencoded)
        $name = $_POST["name"];
        $location = $_POST["location"];
        $field_name = $_POST["field_name"];

        // 1. 중복 항목 검색
        if($statement = $db->prepare("SELECT `idx` FROM `cars` WHERE `name`=? AND `location`=? AND `field_name`=?")) {
            $statement->bind_param("sss", $name, $location, $field_name);

            if($statement->execute()) {
                $statement->store_result();

                if($statement->num_rows > 0) {      // SELECT 문의 결과 행이 1개 이상인 경우 중지
                    exitWithJson_ResultMessagePair("duplicated", "중복된 정보를 가지는 항목이 이미 있습니다.");
                }
            }

            $statement->close();
        }

        $phone_number = trim($_POST["phone_number"]);
        $hash = hash("sha256", $location . "_" . $name . "_" . $field_name);    // SHA256으로 해시 : "현장명_기기이름_현장(임시)이름"

        // 2. Car 추가
        if(empty($name) || empty($location) || empty($phone_number) || empty($field_name)) {
            exitWithJson_ResultMessagePair("empty", "값이 비어있는 필수 파라미터가 있습니다.");
        } else {
            if($statement = $db->prepare("INSERT INTO `cars` (`name`, `location`, `phone_number`, `field_name`, `hash`) VALUES (?, ?, ?, ?, ?)")) {
                $statement->bind_param("sssss", $name, $location, $phone_number, $field_name, $hash);

                if($statement->execute()) {
                    if($statement->affected_rows === 1) {
                        exitWithJson_ResultMessagePair("success", $hash);
                    } else {
                        exitWithJson_ResultMessagePair("affected_rows_not_one", "변경된 열이 하나가 아닙니다.");
                    }
                } else {
                    exitWithJson_ResultMessagePair("db_execute_error", "DB 쿼리문을 실행할 수 없습니다. " . $statement->error);
                }

                $statement->close();
            } else {
                exitWithJson_ResultMessagePair("db_query_error", "DB 쿼리문이 잘못되었습니다.");
            }
        }
    } else {
        exitWithJson_ResultMessagePair("not_post_method", "HTTP 메서드가 잘못되었습니다.");
    }
?>