<?php
    header("Content-Type: application/json; charset=UTF-8");

    include_once($_SERVER["DOCUMENT_ROOT"] . "/php-includes/_common.php");

    if($_SERVER["REQUEST_METHOD"] === "POST") {
        $id = trim($_POST["id"]);
        $password_hash = password_hash($_POST["password"], PASSWORD_BCRYPT);
        $name = trim($_POST["name"]);
        $company = trim($_POST["company"]);
        $field = trim($_POST["field"]);

        if(strcmp($company, $_SESSION["company"]) != 0) {
            exitWithJson_ResultMessagePair("company_violation", "Company(소속 기업명) 값이 현재 로그인된 사용자의 값과 일치하지 않습니다. 잘못된 접근입니다.");
        }

        if(empty($id) || empty($_POST["password"]) || empty($name) || empty($company) || empty($field)) {
            exitWithJson_ResultMessagePair("empty", "필수 파라미터의 값이 비어있습니다.");
        }

        if(mb_strlen($id) > 32) {
            exitWithJson_ResultMessagePair("id_too_long", "ID가 제한 길이를 초과했습니다.");
        }

        if($statement = $db->prepare("INSERT INTO `accounts` (`id`, `pass_hash`, `name`, `company`, `field`) VALUES (?, ?, ?, ?, ?)")) {
            $statement->bind_param("sssss", $id, $password_hash, $name, $company, $field);

            if($statement->execute()) {
                if($statement->affected_rows === 1) {
                    if($statement_created_account = $db->prepare("SELECT `idx`, `id`, `created_at`, `name`, `company`, `field` FROM `accounts` where `id`=?")) {
                        $statement_created_account->bind_param("s", $id);

                        if($statement_created_account->execute()) {
                            $statement_created_account->store_result();

                            if($statement_created_account->num_rows() === 1) {
                                $statement_created_account->bind_result($result["index"],
                                                                        $result["id"],
                                                                        $result["created_at"],
                                                                        $result["name"],
                                                                        $result["company"],
                                                                        $result["field"]);
                                
                                if($statement_created_account->fetch()) {
                                    if(!empty($result["index"]) && !empty($result["created_at"]) && $result["id"] == $id && $result["name"] == $name && $result["company"] == $company && $result["field"] == $field) {
                                        exitWithJson_ResultMessagePair("success", json_encode($result, JSON_UNESCAPED_UNICODE));
                                    } else {
                                        exitWithJson_ResultMessagePair("created_data_wrong", "생성된 계정 데이터가 잘못되었습니다.");
                                    }
                                } else {
                                    exitWithJson_ResultMessagePair("db_fetch_error", "하위 계정 추가 후 생성된 데이터를 가져올 수 없습니다.");
                                }
                            } else {
                                exitWithJson_ResultMessagePair("affected_rows_not_one", "DB 오류. 가져온 열이 하나가 아닙니다.");
                            }
                        } else {
                            exitWithJson_ResultMessagePair("db_execute_error", "DB 쿼리문을 실행할 수 없습니다.");
                        }
                    } else {
                        exitWithJson_ResultMessagePair("db_query_error", "DB 쿼리문이 잘못되었습니다.");
                    }
                } else {
                    exitWithJson_ResultMessagePair("affected_rows_not_one", "DB 오류. 변경된 열이 하나가 아닙니다.");
                }
            } else {
                exitWithJson_ResultMessagePair("db_execute_error", "DB 쿼리문을 실행할 수 없습니다. ID가 중복된 경우일 수도 있습니다.");
            }
        } else {
            exitWithJson_ResultMessagePair("db_query_error", "DB 쿼리문이 잘못되었습니다.");
        }
    } else {
        exitWithJson_ResultMessagePair("not_post_method", "HTTP 메서드가 잘못되었습니다.");
    }
?>