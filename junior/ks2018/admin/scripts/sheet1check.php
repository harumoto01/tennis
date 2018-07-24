<?php
require "../../inc/conf.php";

$client = es_get_client();

$params = [
    "index" => ES_SHEET1,
    "sort" => [
        "uid.keyword"
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

foreach ($response["hits"]["hits"] as $i => $hit) {
    echo $hit["_source"]["uid"] . " " . count($hit["_source"]["medhist"]) . "\n";
}
