<?php
require "../../inc/conf.php";

session_start();

if (!isset($_SESSION["uid"]) || !isset($_SESSION["is_staff"])) {
    header('Content-Type: text/json');
    echo json_encode([
        "status" => "NG",
        "message" => "不正なアクセスです。"
    ]);
    exit(0);
}

try{

    $client = es_get_client();

    $params = [
        "index" => ES_STAFFS,
        "body" => [
            "_source" => [
                "excludes" => [
                    "password"
                ]
            ]
        ],
        "size" => 10000
    ];

    $response = es_search($client, $params);
    if ($response["hits"]["total"] == 0) {
        header('Content-Type: text/json');
        echo json_encode([
            "status" => "OK",
            "data" => [],
            "q" => $params
        ]);
        exit(0);
    }

    $data = [];
    foreach ($response["hits"]["hits"] as $i => $hit) {
        $_source = $hit["_source"];
        $uid = $_source["uid"];

        $data[$uid] = $_source;
    }

    header('Content-Type: text/json');
    echo json_encode([
        "status" => "OK",
        "data" => $data,
        "q" => $params
    ]);

} catch (Exception $e) {
    echo json_encode([
        "status" => "NG",
        "reason" => $e . "!",
        "q" => $params
    ]);
    exit(0);
}
