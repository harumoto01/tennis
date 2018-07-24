<?php
require "../../inc/conf.php";

session_start();

if (!isset($_SESSION["uid"]) || !isset($_SESSION["is_staff"])) {
    echo json_encode([
        "status" => "NG",
        "message" => "不正なアクセスです。"
    ]);
    exit(0);
}

$client = es_get_client();

$params = [
    "index" => ES_STAFFS,
    "body" => [
        "query" => [
            "bool" => [
                "must" => [
                    "match_all" => (object)[]
                ]
            ]
        ],
        "_source" => [
            "includes" => [
                "*"
            ],
            "excludes" => [
                "password"
            ]
        ]
    ],
    "size" => 10000
];

try{
    $response = es_search($client, $params);
} catch (Exception $e) {
    echo json_encode([
        "status" => "NG",
        "reason" => $e . "!",
        "q" => $params
    ]);
    exit(0);
}
if ($response["hits"]["total"] == 0) {
    echo json_encode([
        "status" => "OK",
        "data" => [],
        "q" => $params
    ]);
    exit(0);
}

header('Content-Type: text/json');
$data = [];
foreach ($response["hits"]["hits"] as $i => $hit) {
    $_source = $hit["_source"];
    $uid = $_source["uid"];

    $data[$uid] = $_source;
}
echo json_encode([
    "status" => "OK",
    "data" => $data,
    "q" => $params
]);
