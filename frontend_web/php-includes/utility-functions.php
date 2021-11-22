<?php
    /* JSON utilities */
    function exitWithJson(array $array) {
        echo(json_encode($array, JSON_UNESCAPED_UNICODE));
        exit();
    }

    function exitWithJson_ResultMessagePair(string $result, string $message) {
        exitWithJson(array(
            "result" => $result,
            "message" => $message
        ));
    }
    /* === */

    function exitWithAlert_RedirectAfter(string $alertMessage, string $href) {
        echo("<script>");
            echo("alert('$alertMessage');");
            echo("window.location.href = '$href';");
        echo("</script>");
        exit();
    }

    /* String utilities */
    function startsWith(string $haystack, string $needle) {
        return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== false;
    }

    function endsWith(string $haystack, string $needle) {
        return $needle === "" || (($temp = strlen($haystack) - strlen($needle)) >= 0 && strpos($haystack, $needle, $temp) !== false);
    }
    /* === */
?>