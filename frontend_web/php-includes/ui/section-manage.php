<?php // Parent document must include at least "db.php" and "start-session-and-check-login.php" ?>

<section id="section_manage" data-anchor="manage">
    <div id="subaccount_reset_password_container" class="blackout_dialog" data-index="">
        <div class="heading">(Index) (이름) (아이디)</div>
        <div class="subheading">다음 비밀번호로 재설정합니다.</div>
        <form id="subaccount_reset_password_input_container">
            <input type="password" placeholder="새 비밀번호 (8자 이상)" required minlength="8" />
            <input class="confirm_button" type="button" value="변경" disabled />
            <input class="cancel_button" type="button" value="취소" />
        </form>
    </div>

    <div id="subaccount_edit_container" class="blackout_dialog" data-index="">
        <div class="heading">(Index) (이름) (아이디)</div>
        <div class="subheading">하위 계정의 정보를 수정합니다.</div>
        <form id="subaccount_edit_input_container">
            <div><label>이름</label> <input class="name" type="text" placeholder="계정 이름 혹은 담당자 성함" required /></div>
            <div><label>소속 기업명</label> <input class="company" type="text" placeholder="소속 기업/단체명" required disabled /></div>
            <div><label>현장명 (건물명)</label> <input class="field" type="text" placeholder="담당 현장/구역명" required /></div>
            <input class="confirm_button" type="button" value="변경" disabled />
            <input class="cancel_button" type="button" value="취소" />
        </form>
    </div>

    <div id="car_info_edit_container" class="blackout_dialog" data-hash="">
        <div class="heading">(Car 이름) (Car 위치)</div>
        <div class="subheading">장치의 정보를 수정합니다.</div>
        <form id="car_info_edit_input_container">
            <div><label>설명</label> <input class="description" type="text" placeholder="장치 특성을 이해하기 쉬운 설명" required /></div>
            <input class="confirm_button" type="button" value="변경" disabled />
            <input class="cancel_button" type="button" value="취소" />
        </form>
        <div id="car_reset_call_status_container" style="display: none">
            <hr />
            <input class="reset_calling_status_button" type="button" value="통화 중 상태 초기화" />
            <div>※ "통화 중 상태 초기화" 버튼은 정상적으로 통화가 종료되지 않아<br />지속적으로 통화 중 상태를 유지하고 있는 장치에만 사용하세요.</div>
        </div>
    </div>
    
    <div id="subaccount_manage_container">
        <h1>하위 계정 관리</h1>
        <h3>장치 접근 권한만 갖는 하위 계정을 만들거나 삭제합니다.</h3>

        <div id="subaccount_create_container" class="floating_item">
            <div>하위 계정 추가</div>
            <form id="subaccount_create_form">
                <label for="id">ID</label> <input type="text" name="id" maxlength="32" placeholder="로그인 시 사용 (최대 32자)" required pattern="[A-Za-z0-9_]+" /><br />
                <div class="notice">※ ID는 알파벳 대·소문자, 숫자, 언더바(_)만 포함할 수 있습니다.</div>
                <label for="pw">비밀번호</label> <input type="password" name="pw" placeholder="로그인 시 사용 (최소 8자)" required minlength="8" /><br />
                <label for="name">이름</label> <input type="text" name="name" placeholder="계정 이름 혹은 담당자 성함" required /><br />
                <label for="company">소속 기업명</label> <input type="text" name="company" placeholder="소속하고 있는 기업 혹은 단체명" required value="<?= $_SESSION["company"] ?>" disabled /><br />
                <label for="field">현장명 (건물명)</label> <input type="text" name="field" placeholder="관리를 담당하는 현장 구역명" required /><br />
                <input id="subaccount_create_add_button" type="button" value="추가" name="submit" disabled />
                <input id="subaccount_create_reset_button" type="button" value="초기화" name="_reset" />
            </form>
        </div>

        <div id="subaccount_manage_inner_container">
            <?php
                $result = $db->query("SELECT `idx`, `id`, `created_at`, `last_login_at`, `name`, `company`, `field`, `company_admin`, `el_cs_account` FROM `accounts` WHERE `company`='" . $_SESSION["company"] . "'");

                if($result->num_rows > 0) {
                    while($row = $result->fetch_assoc()) {
                        if($_SESSION["operator_index"] == $row["idx"]) continue;
                        if($row["company_admin"] == 1 || $row["el_cs_account"] == 1) continue;

                        $created_date = date_parse($row["created_at"]);
                        $created_date = $created_date["year"] . "/" . $created_date["month"] . "/" . $created_date["day"];
                        $lastlogin_time = date_parse($row["last_login_at"]);
                        $lastlogin_time = ($lastlogin_time["year"] == 0) ? "로그인 한 적 없음" : $lastlogin_time["year"] . "/" . $lastlogin_time["month"] . "/" . $lastlogin_time["day"] . " " . sprintf("%02d", $lastlogin_time["hour"]) . ":". sprintf("%02d", $lastlogin_time["minute"]);

                        echo("<div class='account_item floating_item' data-index='" . $row["idx"] . "'>");
                            echo("<div class='index_container'>");
                                echo("<div>Index</div>");
                                echo("<div class='account_index'>" . $row["idx"] . "</div>");
                            echo("</div>");
                            echo("<div class='id_container'>");
                                echo("<div class='account_name'>" . $row["name"] . "</div>");
                                echo("<div class='account_id'>ID : " . $row["id"] . "</div>");
                            echo("</div>");
                            echo("<div class='info_container'>");
                                echo("<div class='account_location'><i class='la la-map-marker' aria-hidden='true'></i><span class='company'>" . $row["company"] . "</span> <span class='field'>" . $row["field"] . "</span></div>");
                                echo("<div class='account_created_date'><i class='la la-calendar-o' aria-hidden='true'></i>" . $created_date . "에 계정 생성</div>");
                                echo("<div class='account_last_login'><i class='la la-clock-o' aria-hidden='true'></i>" . $lastlogin_time . "</div>");
                            echo("</div>");
                            echo("<div class='account_control_container'>");
                                echo("<i class='reset_password la la-refresh' aria-hidden='true' data-tooltip='비밀번호 재설정'></i>");
                                echo("<i class='edit la la-edit' aria-hidden='true' data-tooltip='정보 수정'></i>");
                                echo("<i class='remove la la-user-times' aria-hidden='true' data-tooltip='계정 삭제'></i>");
                            echo("</div>");
                        echo("</div>");
                    }
                } else {
                    echo("<div>하위 계정이 없습니다.</div>");
                }

                $result->free();
                unset($result);
            ?>
        </div>
    </div>

    <div id="car_permission_container" class="clearfix">
        <h1>장치 접근 권한 관리</h1>
        <h3>하위 계정 별로 장치에 접근할 수 있는 권한을 설정합니다.</h3>

        <div id="car_permission_inner_container">
            <?php
                $result = $db->query("SELECT `name`, `description`, `operator_index`, `hash` FROM `cars` WHERE `field_name`='" . $_SESSION["company"] . "'");

                if($result->num_rows > 0) {
                    while($row = $result->fetch_assoc()) {
                        echo("<div class='car_item floating_item' data-hash='" . $row["hash"] . "'>");
                            echo("<div class='car_info_container'>");
                                echo("<div class='car_name'>" . $row["name"] . "</div>");
                                echo("<div class='car_desc'>" . $row["description"] . "</div>");
                            echo("</div>");
                            echo("<span class='car_unassigned' " . ($row["operator_index"] == -1 ? "" : "style='display: none'") . "><i class='la la-warning' aria-hidden='true'></i> 할당되지 않음</span>");
                            echo("<i class='la la-edit car_edit_info' aria-hidden='true' data-tooltip='장치 정보 수정'></i>");
                        echo("</div>");
                    }
                }

                $result->free();
                unset($result);
            ?>
        </div>
    </div>

    <script src="/res/js/manage.js"></script>
</section>