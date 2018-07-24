<?php
require "../../inc/conf.php";

session_start();

if (!isset($_SESSION["uid"]) || !isset($_SESSION["is_staff"]) || !isset($_POST["id"])) {
    header('Content-Type: text/json');
    echo json_encode([
        "status" => "NG",
        "message" => "不正なアクセスです。"
    ]);
    exit(0);
}

try {

    $index = isset($_POST["index"]) ? $_POST["index"] : "*";
    $id = isset($_POST["id"]) ? $_POST["id"] : "";

    $client = es_get_client();

    $params = [
        "index" => $index,
        "type" => "_doc",
        "id" => $id
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

