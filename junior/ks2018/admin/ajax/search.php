<?php
require "../../inc/conf.php";

session_start();

if (!isset($_SESSION["uid"])) {
    echo json_encode([
        "status" => "NG",
        "message" => "不正なアクセスです。"
    ]);
    exit(0);
}

$index = isset($_POST["index"]) ? $_POST["index"] : "";
$filter = [];
if (isset($_POST["filter"])) {
    foreach ($_POST["filter"] as $field => $value) {
        $filter[] = [ "term" => [ $field.".keyword" => $value ] ];
//        $filter[] = [ "term" => [ $field => $value ] ];
    }
}
$sort = [];
if (isset($_POST["sort"])) {
    foreach ($_POST["sort"] as $field => $order) {
        $sort[] = [ $field.".keyword" => $order ];
//        $sort[] = [ $field => $order ];
    }
}

$client = es_get_client();

$params = [
    "index" => $index,
    "body" => [
        "query" => [
            "bool" => [
                "filter" => $filter
            ]
        ],
        "sort" => $sort
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
    $_index = $hit["_index"];
    $_id = $hit["_id"];
    $_source = $hit["_source"];

    $data[$_id] = $_source;
}

echo json_encode([
    "status" => "OK",
    "data" => $data,
    "q" => $params
]);