<?php
require "../../inc/conf.php";

session_start();

if (!isset($_SESSION["uid"]) || !isset($_SESSION["is_staff"])) {
    header('Content-Type: text/json');
    echo json_encode([
        "status" => "NG",
        "message" => "タイムアウトのためログアウトしました。"
    ]);
    exit(0);
}

try {
    
    $client = es_get_client();

    $params = [
        "index" => join(",", [ES_PLAYERS, ES_SHEET1, ES_SHEET2]),
        "body" => [
            "sort" => [
                "date" => "desc"
            ],
            "_source" => [
                "excludes" => [ 
                    "s.photo*",
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
        $_index = $hit["_index"];
        $_id = $hit["_id"];
        $_source = $hit["_source"];
        $uid = $_source["uid"];

//    $data[$uid][$_index][] = $_source;
        $data[$uid][$_index][$_id] = $_source;
    }
    $rdata = [];
    foreach ($data as $uid => $d) {
        $rdata[] = $d;
    }

    header('Content-Type: text/json');
    echo json_encode([
        "status" => "OK",
        "data" => $rdata,
        "q" => $params
    ]);

} catch (Exception $e) {
    header('Content-Type: text/json');
    echo json_encode([
        "status" => "NG",
        "reason" => $e . "!",
        "q" => $params
    ]);
    exit(0);
}
