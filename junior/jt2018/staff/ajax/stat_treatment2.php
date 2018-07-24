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
        "index" => join(",", [ES_TRAINER_RECORD,ES_DOCTOR_RECORD]),
        "body" => [
            "sort" => [
                "date" => "asc"
            ],
            "_source" => [
                "excludes" => [
                    "s.photo*"
                ]
            ]
        ],
        "size" => 10000
    ];

    $response = es_search($client, $params);

    $data = [];
    foreach ($response["hits"]["hits"] as $i => $hit) {
        if (!preg_match("/^jt\d{4}$/", $hit["_source"]["uid"])) {
            $date = substr($hit["_source"]["date"], 0, 10);
            foreach ($hit["_source"]["s"] as $j => $sheet) {
                if ($sheet["kind"] == 0) {
                    if (!isset($data_i[$date])) {
                        $data_i[$date] = array_fill(1, 21, 0);
                    }
                    $data_i[$date][$sheet["diagnosis"]]++;
                } else {
                    if (!isset($data_d[$date])) {
                        $data_d[$date] = array_fill(1, 13, 0);
                    }
                    $data_d[$date][$sheet["disease"]]++;
                };
            }
        }
    }
    foreach ($data_i as $date => $tarr) {
        $labels_i[] = $date;
        foreach ($tarr as $i => $t) {
            $datasets_i[$i][] = $t;
        }
    }
    foreach ($data_d as $date => $tarr) {
        $labels_d[] = $date;
        foreach ($tarr as $i => $t) {
            $datasets_d[$i][] = $t;
        }
    }

    header('Content-Type: text/json');
    echo json_encode([
        "status" => "OK",
        "resp" => $response["hits"]["hits"],
        "data_i" => [ "labels" => $labels_i, "datasets" => $datasets_i ],
        "data_d" => [ "labels" => $labels_d, "datasets" => $datasets_d ]
    ]);

} catch (Exception $e) {
    header('Content-Type: text/json');
    echo json_encode([
        "status" => "NG",
        "reason" => $e . "!",
        "data_i" => [ "labels" => [], "datasets" => [] ],
        "data_d" => [ "labels" => [], "datasets" => [] ],
        "q" => $params
    ]);
    exit(0);
}
