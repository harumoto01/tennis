<?php
require "../../inc/conf.php";

session_start();

if (!isset($_SESSION["uid"]) || !isset($_SESSION["is_staff"]) || !isset($_POST["docid"])) {
    header('Content-Type: text/json');
    echo json_encode([
        "status" => "NG",
        "message" => "タイムアウトのためログアウトしました。"
    ]);
    exit(0);
}

try {
    $client = es_get_client();

    $uid = $_SESSION["uid"];

    $docid = $_POST["docid"];
    unset($_POST["docid"]);

    $data = $_POST;

    $data["sleep_yesterday"] = (float)$data["sleep_yesterday"];
    $data["sleep_usual"] = (float)$data["sleep_usual"];

    $data["last_updated"] = date("Y/m/d H:i:s");

    $params = [
        "index" => ES_SHEET2,
        "type" => "_doc",
        "id" => $docid,
        "body" => $data
    ];
    $_SESSION["message"] = "試合当日セルフチェックシートを更新しました。";

    $response = es_index($client, $params);

    putlog("[STAFF] Sheet2 updated: uid " . $data["uid"] . " staffid " . $uid);
    sleep(1);

    header('Content-Type: text/json');
    echo json_encode([
        "status" => "OK",
        "data" => $data
    ]);

} catch (Exception $e) {
    header('Content-Type: text/json');
    echo json_encode([
        "status" => "NG",
        "reason" => $e,
        "q" => $params
    ]);
    exit(0);
}
