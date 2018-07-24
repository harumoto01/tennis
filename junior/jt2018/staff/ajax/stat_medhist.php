<?php
require "../../inc/conf.php";

session_start();

if (!isset($_SESSION["uid"]) || !isset($_SESSION["is_staff"])) {
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
            if (isset($hit["_source"]["medhist"]) && count($hit["_source"]["medhist"]) > 0) {
                foreach ($hit["_source"]["medhist"] as $j => $mh) {
                    $uids[$mh["kind"]][] = $hit["_source"]["uid"];
                }
            }
            if ($hit["_source"]["allergy"]["1"]["yn"] == "1") {
                $uids[12][] = $hit["_source"]["uid"];
            }
            if ($hit["_source"]["allergy"]["2"]["yn"] == "1") {
                $uids[13][] = $hit["_source"]["uid"];
            }
            if ($hit["_source"]["allergy"]["3"]["yn"] == "1") {
                $uids[14][] = $hit["_source"]["uid"];
            }
        }
    }

    $k = 0;
    $ds["12B"]["data"] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    $ds["12G"]["data"] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    $ds["14B"]["data"] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    $ds["14G"]["data"] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    $ds["16B"]["data"] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    $ds["16G"]["data"] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    $ds["18B"]["data"] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    $ds["18G"]["data"] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    foreach ($ds as $cat => $data) {
        $ds[$cat]["label"] = $cat;
    }
    for ($kind = 1; $kind <= 14; $kind++) {
        if ($kind <= 11) {
            $result["labels"][] = $disnames[$kind];
        } else {
            $result["labels"][] = $allergynames[$kind-11];
        }

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
            $k++;
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
