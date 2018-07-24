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

$client = es_get_client();

$id = $_POST["id"];

$params = [
    "index" => ES_SHEET2,
    "type" => "_doc",
    "id" => $id
];
try {
    $response = es_get($client, $params);
} catch (Exception $e) {
    echo json_encode([
        "status" => "NG",
        "reason" => $e,
        "q" => $params
    ]);
    exit(0);
}

$data = $response["_source"];
unset($data["staff_checked"]);

$params = [
    "index" => ES_SHEET2,
    "type" => "_doc",
    "id" => $id,
    "body" => $data
];

try{
    $response = es_index($client, $params);
} catch (Exception $e) {
    echo json_encode([
        "status" => "NG",
        "reason" => $e,
        "q" => $params
    ]);
    exit(0);
}

sleep(.2);
echo json_encode($data);
putlog("[STAFF] Treatment record checked: uid = " . $data["uid"] . " staffid " . $_SESSION["uid"]);
