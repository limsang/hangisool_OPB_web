<?php
    define("CONFIG_OEM_MODE", FALSE);                              // OEM mode. `TRUE` means activate OEM mode, `FALSE` means not.
    define("CONFIG_OEM_TYPE", OEMType::MITSUBISHI_ELEVATOR);       // Select OEM type. Available types are defined below (`OEMType` class).

    define("CONFIG_BACKEND_HOST", "192.168.1.22");
    define("CONFIG_BACKEND_PORT", "4143");
    define("CONFIG_BACKEND_EMERGENCY_FLAG_QUERY_PORT", "4144");

    define("CONFIG_DATABASE_HOST",       "localhost");
    define("CONFIG_DATABASE_ACCOUNT_ID", "ecws_test");
    define("CONFIG_DATABASE_ACCOUNT_PW", "rrWwNYtmJTYelUrf");
    define("CONFIG_DATABASE_DB_NAME",    "ecws_test");
?>

<?php /* DO NOT EDIT BELOW */
    class OEMType {
        const HANGISOOL = 0;
        const MITSUBISHI_ELEVATOR = 1;
        const FUJITEC_ELEVATOR = 2;

        public static function getOEMResources(int $oemType) {
            switch($oemType) {
                case OEMType::MITSUBISHI_ELEVATOR:
                    return array(
                        "alias" => "mitsubishi",
                        "name_ko" => "한국미쓰비시엘리베이터",
                        "name_en" => "Mitsubishi Elevator Korea Co., Ltd.",
                        "name_ja" => "韓国三菱エレベーター",
                        "url" => "https://www.mitsubishielevator.co.kr",
                        "override_css_path" => "/stylesheets/oem/mitsubishi.css",
                        "logo_image_path" => "/res/oem/mitsubishi/logo.svg"
                    );
                    break;
                case OEMType::FUJITEC_ELEVATOR:
                    return array(
                        "alias" => "fujitec",
                        "name_ko" => "후지테크코리아",
                        "name_en" => "Fujitec Korea Co., Ltd.",
                        "name_ja" => "フジテック・コリア",
                        "url" => "http://www.fujiteckorea.co.kr",
                        "override_css_path" => "/stylesheets/oem/fujitec.css",
                        "logo_image_path" => "/res/oem/fujitec/logo.svg"
                    );
                    break;
                default:
                    return array(
                        "alias" => "etc",
                        "name_ko" => "한기술",
                        "name_en" => "Han Technology Co., Ltd.",
                        "name_ja" => "韓技術",      // temp
                        "url" => "http://www.hangisool.co.kr",
                        "override_css_path" => NULL,
                        "logo_image_path" => "/res/logo.svg"
                    );
                    break;
            }
        }
    }

    if(CONFIG_OEM_MODE === TRUE) {
        define("OEM_RESOURCE_INFO", OEMType::getOEMResources(CONFIG_OEM_TYPE));
    } else {
        define("OEM_RESOURCE_INFO", OEMType::getOEMResources(OEMType::HANGISOOL));
    }
    
    define("ECWS_VERSION", "0.0.0-InDev");
?>