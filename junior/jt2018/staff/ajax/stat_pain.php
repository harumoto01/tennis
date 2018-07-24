<?php
require "../../inc/conf.php";

session_start();

if (!isset($_SESSION["uid"]) || !isset($_SESSION["is_staff"])) {
    header('Content-Type: text/json');
    echo json_encode([
        "status" => "NG",
        "message" => "�����ʥ��������Ǥ���"
    ]);
    exit(0);
}

try {
    $client = es_get_client();

    $params = [
        "index" => ES_SHEET1,
        "body" => [
            "sort" => [
                "date" => "asc"
            ]
        ],
        "size" => 10000
    ];

    $resp1 = es_search($client, $params);

    $uids = [];
    foreach ($resp1["hits"]["hits"] as $i => $hit) {
        if (!preg_match("/^jt\d{4}$/", $hit["_source"]["uid"])) {
            if (isset($hit["_source"]["pain"]) && count($hit["_source"]["pain"]) > 0) {
                foreach ($hit["_source"]["pain"] as $j => $ph) {
                    $uids[$ph["kind"]][] = $hit["_source"]["uid"];
                }
            }
        }
    }

    $ds["12B"]["data"] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    $ds["12G"]["data"] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    $ds["14B"]["data"] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    $ds["14G"]["data"] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    $ds["16B"]["data"] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    $ds["16G"]["data"] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    $ds["18B"]["data"] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    $ds["18G"]["data"] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    foreach ($ds as $cat => $data) {
        $ds[$cat]["label"] = $cat;
    }
    for ($kind = 1; $kind <= 21; $kind++) {
        $result["labels"][] = $bodyparts[$kind];

        if (!isset($uids[$kind])) {
        } else {
            $uids2 = $uids[$kind];
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

            $resp2 = es_search($client, $params);

            foreach ($resp2["aggregations"]["group_by_category"]["buckets"] as $i => $aggdata) {
                $category = $aggdata["key"];
                foreach ($aggdata["group_by_gender"]["buckets"] as $j => $aggdata2) {
                    $gender = $aggdata2["key"];
                    $cat = $category . ($gender == "m" ? "B":"G");
                    $ds[$cat]["data"][$kind-1] = $aggdata2["doc_count"];
                }
            }
        }
    }
    foreach ($ds as $cat => $v) {
        $result["datasets"][] = $v;
    }

    header('Content-Type: text/json');
    echo json_encode([
        "status" => "OK",
        "data" => $result
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
