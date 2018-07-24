<?php
require "../../inc/conf.php";

session_start();

if (!isset($_SESSION["uid"]) || !isset($_SESSION["is_admin"])) {
    header('Content-Type: text/json');
    echo json_encode([
        "status" => "NG",
        "message" => "不正なアクセスです。"
    ]);
    exit(0);
}

try {
    $client = es_get_client();

    $params = [
        "index" => ES_SHEET1,
        "body" => [
            "query" => [
                "range" => [
                    "date" => [
                        "gte" => "2018/06/28"
                    ]
                ]
            ],
            "aggs" => [
                "sheet1count" => [
                    "date_histogram" => [
                        "field" => "date",
                        "interval" => "day",
                        "format" => "yyyy-MM-dd"
                    ]
                ]
            ]
        ],
        "size" => 0
    ];

    $response = es_search($client, $params);

    header('Content-Type: text/json');
    echo json_encode([
        "status" => "OK",
        "data" => $response["aggregations"]["sheet1count"]["buckets"],
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
