<?php
require "../../inc/conf.php";

session_start();

if (!isset($_SESSION["uid"]) || !isset($_POST["docid"])) {
    header('Content-Type: text/json');
    echo json_encode([
        "status" => "NG",
        "message" => "不正なアクセスです。"
    ]);
    exit(0);
}

$docid = $_POST["docid"];

try {
    $client = es_get_client();

    $params = [
        "index" => ES_SHEET2,
        "type" => "_doc",
        "id" => $docid
    ];

    $response = es_get($client, $params);

    $data = $response["_source"];

    header('Content-Type: text/json');
    echo json_encode([
        "status" => "OK",
        "data" => $data,
        "q" => $params
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
