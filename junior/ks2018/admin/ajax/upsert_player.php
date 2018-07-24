<?php
require "../../inc/conf.php";

session_start();

if (!isset($_SESSION["uid"]) || !isset($_SESSION["is_admin"]) || !$_SESSION["is_admin"]) {
    $_SESSION["message"] = "タイムアウトのためログアウトしました。";
    header("Location: index.php");
}


$client = es_get_client();

$data["uid"] = $_POST["uid"];
$data["name"] = $_POST["name"];
$data["name_kana"] = $_POST["name_kana"];
$data["gender"] = $_POST["gender"];
$date = new DateTime();
$date->setDate($_POST["birth_year"], $_POST["birth_month"], $_POST["birth_day"]);
$data["birthdate"] = $date->format("Y/m/d 00:00:00");
//$data["school"] = $_POST["school"];
$data["club"] = $_POST["club"];
$data["pref"] = $_POST["pref"];
$data["category"] = $_POST["category"];
if (isset($_POST["password_changed"])) {
    $data["password_changed"] = false;
} else {
    $data["password_changed"] = true;
}
$data["email"] = $_POST["email"];

if (isset($_POST["id"]) && $_POST["id"] != "") {
    $id = $_POST["id"];
    $params = [
        "index" => ES_PLAYERS,
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
    if ($id != $data["uid"]) { // ID変更
        $params = [
            "index" => ES_PLAYERS,
            "type" => "_doc",
            "id" => $id
        ];
        $response_del = es_delete($client, $params);
    }
    $logstr = "[ADMIN] Player data updated: uid " . $data["uid"];
} else {
    $data["password"] = hash("ripemd160", $_POST["password"]);
    $data["date"] = date("Y/m/d H:i:s");
    $data["last_updated"] = $data["date"];
    $logstr = "[ADMIN] Player data inserted: uid " . $data["uid"];
}

$params = [
    "index" => ES_PLAYERS,
    "type" => "_doc",
    "id" => $data["uid"],
    "body" => $data
];

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
