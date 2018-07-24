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
    $client = es_get_client();

    $id = $_POST["id"];

    $params = [
        "index" => ES_SHEET2,
        "type" => "_doc",
        "id" => $id
    ];

    $response = es_get($client, $params);

    $data = $response["_source"];
    $data["staff_checked"] = "1";

    $params = [
        "index" => ES_SHEET2,
        "type" => "_doc",
        "id" => $id,
        "body" => $data
    ];

    $response = es_index($client, $params);

    sleep(.2);
    
    header('Content-Type: text/json');
    echo json_encode($data);
    putlog("[STAFF] Treatment record checked: uid = " . $data["uid"] . " staffid " . $_SESSION["uid"]);

} catch (Exception $e) {
    header('Content-Type: text/json');
    echo json_encode([
        "status" => "NG",
        "reason" => $e,
        "q" => $params
    ]);
    exit(0);
}

