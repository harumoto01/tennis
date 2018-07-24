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

$today = date("Y/m/d");
$params = [
    "index" => ES_SHEET2,
    "body" => [
        "query" => [
            "range" => [
                "date" => [
                    "gte" => $today,
                    "lte" => $today
                ]
            ]
        ]
    ],
    "size" => 10000
];

try{
    $resp1 = es_search($client, $params);
} catch (Exception $e) {
    echo json_encode([
        "status" => "NG",
        "reason" => $e . "!",
        "q" => $params
    ]);
    exit(0);
}

$uids = [];
foreach ($resp1["hits"]["hits"] as $i => $hit) {
    if (!preg_match("/^ks\d{4}$/", $hit["_source"]["uid"])) {
//    if (true) {
        if (isset($hit["_source"]["stat"])) {
            $cnt = count($hit["_source"]["stat"]);
            $uids[$cnt][] = $hit["_source"]["uid"];
        } else {
            $uids[0][] = $hit["_source"]["uid"];
        }
    }
}

$k = 0;
$ds["12B"]["data"] = [0,0,0,0,0,0,0,0,0];
$ds["12G"]["data"] = [0,0,0,0,0,0,0,0,0];
$ds["14B"]["data"] = [0,0,0,0,0,0,0,0,0];
$ds["14G"]["data"] = [0,0,0,0,0,0,0,0,0];
$ds["16B"]["data"] = [0,0,0,0,0,0,0,0,0];
$ds["16G"]["data"] = [0,0,0,0,0,0,0,0,0];
$ds["18B"]["data"] = [0,0,0,0,0,0,0,0,0];
$ds["18G"]["data"] = [0,0,0,0,0,0,0,0,0];
foreach ($ds as $cat => $data) {
    $ds[$cat]["label"] = $cat;
}
foreach ($uids as $cnt => $uids2) {
    $params = [
        "index" => ES_PLAYERS,
        "body" => [
            "query" => [
                "bool" => [
                    "filter" => [
                        "terms" => [
                            "uid.keyword" => $uids2
                        ]
                    ]
                ]
            ],
            "aggs" => [
                "group_by_category" => [
                    "terms" => [
                        "field" => "category.keyword"
                    ],
                    "aggs" => [
                        "group_by_gender" => [
                            "terms" => [
                                "field" => "gender.keyword"
                            ]
                        ]
                    ]
                ]
            ]
        ],
        "size" => 0
    ];

    $response = es_search($client, $params);

    foreach ($response["aggregations"]["group_by_category"]["buckets"] as $i => $aggdata) {
        $category = $aggdata["key"];
        foreach ($aggdata["group_by_gender"]["buckets"] as $j => $aggdata2) {
            $gender = $aggdata2["key"];
            $cat = $category . ($gender == "m" ? "B":"G");
            $ds[$cat]["data"][$cnt] = $aggdata2["doc_count"];
        }
    }
}
$result["labels"] = [ 0,1,2,3,4,5,6,7,8 ];

foreach ($ds as $cat => $v) {
    $result["datasets"][] = $v;
}

header('Content-Type: text/json');
echo json_encode([
    "status" => "OK",
    "resp" => $resp1["hits"]["hits"],
    "data" => $result
]);
