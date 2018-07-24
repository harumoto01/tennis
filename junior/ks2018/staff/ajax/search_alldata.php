<?php
require "../../inc/conf.php";

session_start();

if (!isset($_SESSION["uid"]) || !isset($_SESSION["is_staff"])) {
    echo json_encode([
        "status" => "NG",
        "message" => "タイムアウトのためログアウトしました。"
    ]);
    exit(0);
}

$index = isset($_POST["index"]) ? $_POST["index"] : "";
$filter = [];
if (isset($_POST["filter"])) {
    foreach ($_POST["filter"] as $field => $value) {
        $filter[] = [ "term" => [ $field.".keyword" => $value ] ];
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
    $uid = $_source["uid"];

//    $data[$uid][$_index][] = $_source;
    $data[$uid][$_index][$_id] = $_source;
}
$rdata = [];
foreach ($data as $uid => $d) {
    $rdata[] = $d;
}
echo json_encode([
    "status" => "OK",
    "data" => $rdata,
    "q" => $params
]);
