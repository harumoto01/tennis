<?php
require "../../inc/conf.php";

session_start();

if (!isset($_SESSION["uid"])) {
    header('Content-Type: text/json');
    echo json_encode([
        "status" => "NG",
        "message" => "タイムアウトしました。"
    ]);
    exit(0);
}

$uid = $_SESSION["uid"];

try {

    $data = $_POST;
    putlog3("put_sheet2 start " . $uid);
    putlog3(print_r($_POST, true));
    if (isset($data["docid"])) {
        $docid = $data["docid"];
        unset($data["docid"]);
    } else {
        $docid = "";
    }

    $data["uid"] = $uid;

    $data["sleep_yesterday"] = (float)$data["sleep_yesterday"];
    $data["sleep_usual"] = (float)$data["sleep_usual"];

    if ($docid != "") {
        $data["last_updated"] = date("Y/m/d H:i:s");

        $params = [
            "index" => ES_SHEET2,
            "type" => "_doc",
            "id" => $docid,
            "body" => $data
        ];
        $_SESSION["message"] = "試合当日セルフチェックシートを更新しました。";
        putlog("[PLAYER] Sheet2 updated: uid " . $uid);
    } else {
        $data["date"] = date("Y/m/d H:i:s");
        $data["last_updated"] = $data["date"];
        $params = [
            "index" => ES_SHEET2,
            "type" => "_doc",
            "body" => $data
        ];
        $_SESSION["message"] = "試合当日セルフチェックシートを登録しました。";
        putlog("[PLAYER] Sheet2 inserted: uid " . $uid);
    }

    $client = es_get_client();

    $response = es_index($client, $params);

    sleep(2);
    header('Content-Type: text/json');
    echo json_encode($response);

    putlog3("put_sheet2 end " . $uid);
    putlog3(print_r($data, true));

} catch (Exception $e) {
    header('Content-Type: text/json');
    echo json_encode([
        "status" => "NG",
        "reason" => $e,
        "q" => $params
    ]);
    exit(0);
}
