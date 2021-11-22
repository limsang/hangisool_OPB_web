<?php // Parent document must include at least "db.php" and "start-session-and-check-login.php"
    $result = $db->query("SELECT * FROM `cars` ORDER BY `location` ASC, `name` ASC");

    if($result->num_rows > 0) {
        $current_location = "";

        $car_location_item_part = "<div id='dashboard_devices_location_container'>" .
                                      "<div class='floating_item location_item see_all active' data-location='##see_all##'>" .
                                          "<i class='la la-crosshairs' aria-hidden='true'></i>" .
                                          "<span>전체 보기</span>" .
                                      "</div>";
        $car_device_item_part = "";

        while($row = $result->fetch_assoc()) {
            $car_hash = $row["hash"];
            $car_name = $row["name"];
            $car_field_name = $row["field_name"];
            $car_location = $row["location"];
            $car_desc = $row["description"];
            $car_operator_index = explode(",", $row["operator_index"]);
            $car_phone_number = $row["phone_number"];

            if($car_field_name == $_SESSION["company"] && ($_SESSION["is_company_admin"] == 1 || in_array($_SESSION["operator_index"], $car_operator_index))) {
                if($car_location != $current_location) {
                    $car_location_item_part .= "<div class='floating_item location_item' data-location='$car_location'>" .
                        "<i class='la la-map-marker' aria-hidden='true'></i>" .
                        "<span>$car_location</span>" .
                    "</div>";

                    $current_location = $car_location;
                }

                $car_device_item_part .= "<div class='floating_item device_item' data-hash='$car_hash' data-location='$car_location'>" .
                    "<div class='name'>$car_name</div>" .
                    "<div class='description'><i class='la la-angle-right' aria-hidden='true'></i><span>$car_desc</span></div>" .
                    "<div class='phone_number'><i class='la la-tty' aria-hidden='true'></i><span>$car_phone_number</span></div>" .
                    "<div class='status'><i class='la la-refresh' aria-hidden='true'></i><span>확인 중</span></div>" .
                    "<div class='time_happened' style='display:none'><i class='la la-clock-o' aria-hidden='true'></i></div>" .
                "</div>";
            }
        }

        $car_location_item_part .= "</div>";
        echo($car_location_item_part . $car_device_item_part);

        unset($current_location, $car_location_item_part, $car_device_item_part);
    }

    unset($result);
?>
