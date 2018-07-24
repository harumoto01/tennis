<?php
require "../../inc/conf.php";

session_start();

if (!isset($_SESSION["uid"]) || !isset($_SESSION["is_admin"]) || !$_SESSION["is_admin"]) {
    $_SESSION["message"] = "タイムアウトのためログアウトしました。";
    header("Location: index.php");
}

$client = es_get_client();

$data["kind"] = $_POST["kind"];
$data["uid"] = $_POST["uid"];
$data["name"] = $_POST["name"];
$data["name_kana"] = $_POST["name_kana"];
$data["gender"] = $_POST["gender"];

if (isset($_POST["id"]) && $_POST["id"] != "") {
    $id = $_POST["id"];
    $params = [
        "index" => ES_STAFFS,
        "type" => "_doc",
        "id" => $id
    ];
    $response = es_get($client, $params);
    $data["date"] = $response["_source"]["date"];
    $data["last_updated"] = date("Y/m/d H:i:s");
    if ($_POST["password"] != "") {
        $data["password"] = hash("ripemd160", $_POST["password"]);
    } else {
        $data["password"] = $response["_source"]["password"];
    }

    $params = [
        "index" => ES_STAFFS,
        "type" => "_doc",
        "id" => $id,
        "body" => $data
    ];
    $logstr = "[ADMIN] Staff data updated: staffid " . $data["uid"];
} else {
    $data["password"] = hash("ripemd160", $_POST["password"]);
    $data["date"] = date("Y/m/d H:i:s");
    $data["last_updated"] = $data["date"];
    $params = [
        "index" => ES_STAFFS,
        "type" => "_doc",
        "id" => $data["uid"],
        "body" => $data
    ];
    $logstr = "[ADMIN] Staff data inserted: staffid " . $data["uid"];
}

try {
    $response = es_index($client, $params);
} catch (Exception $e) {
    echo json_encode([
        "status" => "NG",
        "reason" => $e,
        "q" => $params
    ]);
    exit(0);
}

sleep(1);
echo json_encode([
    "status" => "OK",
    "data" => $data
]);
putlog($logstr);