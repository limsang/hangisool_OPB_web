<?php
    header("Content-Type: application/json; charset=UTF-8");

    include_once($_SERVER["DOCUMENT_ROOT"] . "/php-includes/_common.php");

    if($_SERVER["REQUEST_METHOD"] === "POST") {
        $account_index = trim($_POST["index"]);
        $car_hash = trim($_POST["hash"]);
        $value = trim($_POST["value"]);      // 0 to delete, 1 to add

        if(!(isset($_POST["index"]) && isset($_POST["hash"]) && isset($_POST["value"]))) {
            exitWithJson_ResultMessagePair("empty", "필수 요소 값이 비어있습니다.");
        } else {
            $available_operators = array();

            if($result = $db->query("SELECT `idx` FROM `accounts`")) {
                while($row = $result->fetch_assoc()) {
                    array_push($available_operators, $row["idx"]);
                }
            }

            if($statement1 = $db->prepare("SELECT `operator_index` FROM `cars` WHERE `hash`=?")) {
                $statement1->bind_param("s", $car_hash);

                if($statement1->execute()) {
                    $statement1->store_result();

                    if($statement1->num_rows() === 1) {
                        $statement1->bind_result($current_operators);

                        if($statement1->fetch()) {
                            if($current_operators == NULL || trim($current_operators) == "") {
                                $current_operators = "-1";
                            }

                            $current_operators = explode(",", trim($current_operators));

                            if(in_array("-1", $current_operators)) {
                                $unassigned_key = array_search("-1", $current_operators);
                                if($unassigned_key !== FALSE) {
                                    array_splice($current_operators, $unassigned_key, 1);
                                }
                            }

                            if($value == 0) {
                                $key = array_search($account_index, $current_operators);
                                if($key !== FALSE) {
                                    array_splice($current_operators, $key, 1);
                                }
                            } else if($value == 1) {
                                if(!in_array($account_index, $current_operators)) {
                                    array_push($current_operators, $account_index);
                                }
                            }

                            if(count($current_operators) === 0) {
                                array_push($current_operators, "-1");
                            }

                            foreach($current_operators as $key => $value) {
                                if($value == "-1") break;

                                if(in_array($value, $available_operators) === FALSE) {
                                    array_splice($current_operators, $key, 1);
                                }
                            }

                            $current_operators = implode(",", $current_operators);

                            if($statement2 = $db->prepare("UPDATE `cars` SET `operator_index`=? WHERE `hash`=?")) {
                                $statement2->bind_param("ss", $current_operators, $car_hash);

                                if($statement2->execute()) {
                                    if($statement2->affected_rows === 1) {
                                        exitWithJson_ResultMessagePair("success", $current_operators);
                                    } else {
                                        exitWithJson_ResultMessagePair("affected_rows_not_one", "변경된 열이 하나가 아닙니다.");
                                    }
                                } else {
                                    exitWithJson_ResultMessagePair("db_execute_error", "DB 쿼리문을 실행할 수 없습니다.");
                                }
                            } else {
                                exitWithJson_ResultMessagePair("db_query_error", "DB 쿼리문이 잘못되었습니다.");
                            }
                        } else {
                            exitWithJson_ResultMessagePair("db_fetch_error", "DB 쿼리로부터 결과를 가져올 수 없습니다.");
                        }
                    } else {
                        exitWithJson_ResultMessagePair("num_rows_not_one", "가져온 열이 한 개가 아닙니다.");
                    }
                } else {
                    exitWithJson_ResultMessagePair("db_execute_error", "DB 쿼리문을 실행할 수 없습니다.");
                }
            } else {
                exitWithJson_ResultMessagePair("db_query_error", "DB 쿼리문이 잘못되었습니다.");
            }
        }
    } else {
        exitWithJson_ResultMessagePair("method_not_allowed", "올바른 HTTP 메서드가 아닙니다.");
    }
?>