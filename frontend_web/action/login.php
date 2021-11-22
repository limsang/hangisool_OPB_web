<?php
    header("Content-Type: application/json; charset=UTF-8");

    include_once($_SERVER["DOCUMENT_ROOT"] . "/php-includes/db.php");
    include_once($_SERVER["DOCUMENT_ROOT"] . "/php-includes/utility-functions.php");
    
    session_cache_expire(720);
    session_start();
    if(isset($_SESSION["logged_in"]) && $_SESSION["logged_in"] === true) {
        header("Location: /");
    }


    if($_SERVER["REQUEST_METHOD"] === "POST" && strpos($_SERVER["HTTP_REFERER"], "login.php") !== FALSE) {
        $id = trim($_POST["id"]);
        $pw = $_POST["password"];

        if(mb_strlen($id) > 32) {
            exitWithJson_ResultMessagePair("id_too_long", "ID가 제한 길이를 초과했습니다. ID를 다시 한 번 확인해 주세요.");
        }

        if(empty($id)) {
            exitWithJson_ResultMessagePair("empty_id", "ID가 공란입니다. ID를 다시 한 번 확인해 주세요.");
        } else if(empty($pw)) {
            exitWithJson_ResultMessagePair("empty_pw", "비밀번호가 공란입니다. 비밀번호를 다시 한 번 확인해 주세요.");
        }

        if(!empty($id) && !empty($pw)) {
            if($statement = $db->prepare("SELECT `idx`, `pass_hash`, `name`, `company`, `field`, `company_admin`, `el_company`, `el_cs_account` FROM `accounts` WHERE BINARY `id`=?")) {
                $statement->bind_param("s", $id);

                if($statement->execute()) {
                    $statement->store_result();

                    if($statement->num_rows() === 1) {
                        $statement->bind_result($result["idx"], $result["pass_hash"],
                                                $result["name"], $result["company"],
                                                $result["field"], $result["company_admin"],
                                                $result["el_company"], $result["el_cs_account"]);

                        if($statement->fetch()) {
                            if(password_verify($pw, $result["pass_hash"])) {
                                session_start();
                                
                                $_SESSION["logged_in"] = true;
                                $_SESSION["id"] = $id;
                                $_SESSION["name"] = $result["name"];
                                if($result["el_cs_account"] == 0) {
                                    $_SESSION["operator_index"] = $result["idx"];
                                    $_SESSION["company"] = $result["company"];
                                    $_SESSION["field"] = $result["field"];
                                    $_SESSION["is_company_admin"] = $result["company_admin"];
                                } else {
                                    $_SESSION["el_company"] = $result["el_company"];
                                    $_SESSION["is_el_cs_account"] = $result["el_cs_account"];
                                }
                                $_SESSION["session_ip"] = $_SERVER["REMOTE_ADDR"];

                                if($db->query("UPDATE `accounts` SET `last_login_at`='" . (date("Y-m-d H:i:s", time())) . "' WHERE `idx`=" . $result["idx"]) === TRUE) {
                                    exitWithJson_ResultMessagePair("success", $result["el_cs_account"]);
                                } else {
                                    exitWithJson_ResultMessagePair("success", "로그인 성공 (마지막 로그인 시간 정보 저장 실패)");
                                }
                            } else {
                                exitWithJson_ResultMessagePair("pw_mismatch", "ID 또는 비밀번호가 잘못되었습니다.");
                            }

                            unset($result);
                        }
                    } else {
                        exitWithJson_ResultMessagePair("no_account", "ID 또는 비밀번호가 잘못되었습니다.");
                    }
                } else {
                    exitWithJson_ResultMessagePair("internal_error", "내부 오류가 발생했습니다. 잠시 후 다시 시도해 보세요.");
                }

                $statement->close();
                unset($statement);
            } else {
                exitWithJson_ResultMessagePair("db_error", "DB 쿼리문이 잘못되었거나 기타 데이터베이스 오류입니다.");
            }
        }
    } else {
        exitWithJson_ResultMessagePair("method_not_allowed", "HTTP 메서드가 잘못되었습니다.");
    }
?>