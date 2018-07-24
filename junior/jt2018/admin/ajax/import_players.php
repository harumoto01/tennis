<?php
require "../../inc/conf.php";
mb_internal_encoding('utf-8');

session_start();

if (!isset($_SESSION["uid"])) {
    header('Content-Type: text/json');
    echo json_encode([
        "status" => "NG",
        "message" => "不正なアクセスです。"
    ]);
    exit(0);
}

try {
    $client = es_get_client();

    $data = json_decode($_POST["list"], true);

    foreach ($data as $i => $pd) {
        $data[$i]["birthdate"] = $pd["birthdate"]." 00:00:00";
        $data[$i]["pref"] = (string)$pd["pref"];
        $date[$i]["category"] = (string)$pd["category"];
        $data[$i]["date"] = date("Y/m/d H:i:s");
        $data[$i]["last_updated"] = $data[$i]["date"];
        $data[$i]["password"] = hash("ripemd160", $pd["password"]);
        $data[$i]["password_changed"] = false;

        $params = [
            "index" => ES_PLAYERS,
            "type" => "_doc",
            "id" => $data[$i]["uid"],
            "body" => $data[$i]
        ];
        $response = es_index($client, $params);
    }

    header('Content-Type: text/json');
    echo json_encode([
        "count" => count($data),
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
