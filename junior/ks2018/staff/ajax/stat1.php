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
header('Content-Type: text/json');
$data = [];
foreach ($response["hits"]["hits"] as $i => $hit) {
    $date = substr($hit["_source"]["date"], 0, 10);
    if (!isset($data[$date])) {
        $data[$date] = [ "1" => 0,"2" => 0,"3" => 0,"4" => 0,"5" => 0 ];
    }
    if (!preg_match("/^ks\d{4}$/", $hit["_source"]["uid"])) {
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

echo json_encode([
    "status" => "OK",
    "resp" => $response["hits"]["hits"],
    "data" => [ "dates" => $dates, "treatment" => $treatment ]
]);
