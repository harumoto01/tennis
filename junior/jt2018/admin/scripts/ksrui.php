<?php
require "../../inc/conf.php";

$client = es_get_client();

$uid = 'ksかつや030917';

$params = [
    "index" => ES_SHEET2,
    "body" => [
        "query" => [
            "bool" => [
                "filter" => [
                    "term" => [
                        "uid.keyword" => $uid
                    ]
                ]
            ]
        ]
    ]
];

$response = es_search($client, $params);
$docid = $response["hits"]["hits"][0]["_id"];
$data = $response["hits"]["hits"][0]["_source"];
$data["uid"] = "ksかつや040917";

$params = [
    "index" => ES_SHEET2,
    "type" => "_doc",
    "id" => $docid,
    "body" => $data
];

$response = es_index($client, $params);

print_r($data);