<?php
require "../../inc/conf.php";

session_start();

if (!isset($_SESSION["uid"]) || !isset($_SESSION["is_admin"])) {
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
            "sort" => [
                "date" => "asc"
            ]
        ],
        "size" => 10000
    ];

    $resp1 = es_search($client, $params);
    $uids = [];
    foreach ($resp1["hits"]["hits"] as $i => $hit) {
        if (!preg_match("/^ks\d{4}$/", $hit["_source"]["uid"])) {
            $date = $hit["_source"]["date"];
            $uids[substr($date, 0, 10)][] = $hit["_source"]["uid"];
        }
    }

    $k = 0;
    foreach ($uids as $date => $uids2) {
    
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
        $result["labels"][] = $date;
        $result["datasets"]["12B"][] = 0;
        $result["datasets"]["12G"][] = 0;
        $result["datasets"]["14B"][] = 0;
        $result["datasets"]["14G"][] = 0;
        $result["datasets"]["16B"][] = 0;
        $result["datasets"]["16G"][] = 0;
        $result["datasets"]["18B"][] = 0;
        $result["datasets"]["18G"][] = 0;

        foreach ($response["aggregations"]["group_by_category"]["buckets"] as $i => $aggdata) {
            $category = $aggdata["key"];
            foreach ($aggdata["group_by_gender"]["buckets"] as $j => $aggdata2) {
                $gender = $aggdata2["key"];
//            $result[$category.($gender == "m" ? "B":"G")][$date] = $aggdata2["doc_count"];
                $result["datasets"][$category.($gender == "m" ? "B":"G")][$k] = $aggdata2["doc_count"];
            }
        }
        $k++;
    }
    header('Content-Type: text/json');
    echo json_encode([
        "status" => "OK",
//    "data" => $response["aggregations"]["group_by_date"]["buckets"],
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
