<?php
require "../../inc/conf.php";

session_start();

if (!isset($_SESSION["uid"]) || !isset($_SESSION["is_staff"]) || !isset($_POST["id"])) {
    echo json_encode([
        "status" => "NG",
        "message" => "不正なアクセスです。"
    ]);
    exit(0);
}

$index = isset($_POST["index"]) ? $_POST["index"] : "*";
$id = isset($_POST["id"]) ? $_POST["id"] : "";

$client = es_get_client();

$params = [
    "index" => $index,
    "type" => "_doc",
    "id" => $id
];

try{
    $response = es_get($client, $params);
} catch (Exception $e) {
    echo json_encode([
        "status" => "NG",
        "reason" => $e,
        "q" => $params
    ]);
    exit(0);
}

header('Content-Type: text/json');
$data = $response["_source"];

echo json_encode([
    "status" => "OK",
    "data" => $data,
    "q" => $params
]);
