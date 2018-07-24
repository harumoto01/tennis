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
        "index" => ES_TRAINER_RECORD,
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
        $date = substr($hit["_source"]["date"], 0, 10);
        if (!isset($data[$date])) {
            $data[$date] = [ "1" => 0,"2" => 0,"3" => 0,"4" => 0,"5" => 0 ];
        }
        if (!preg_match("/^jt\d{4}$/", $hit["_source"]["uid"])) {
            foreach ($hit["_source"]["s"] as $j => $sheet) {
                if ($sheet["kind"] == 0) {
                    foreach ($sheet["treatment"] as $k => $t) {
                
                        $data[$date][$t]++;
                    }
                }
            };
        }
    }
    foreach ($data as $date => $tarr) {
        $dates[] = $date;
        foreach ($tarr as $i => $t) {
            $treatment[$i][] = $t;
        }
    }

    header('Content-Type: text/json');
    echo json_encode([
        "status" => "OK",
        "resp" => $response["hits"]["hits"],
        "data" => [ "dates" => $dates, "treatment" => $treatment ]
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
