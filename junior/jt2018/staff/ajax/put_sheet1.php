<?php
require "../../inc/conf.php";

session_start();

if (!isset($_SESSION["uid"]) || !isset($_SESSION["is_staff"]) || !isset($_POST["docid"])) {
    header('Content-Type: text/json');
    echo json_encode([
        "status" => "NG",
        "message" => "タイムアウトのためログアウトしました。"
    ]);
    exit(0);
}

try {

    $client = es_get_client();

    $uid = $_SESSION["uid"];

    $docid = $_POST["docid"];
    unset($_POST["docid"]);

    $data = $_POST;

    $data["career_year"] = (int)$data["career_year"];
    $data["career_month"] = (int)$data["career_month"];
    $data["career_month_total"] = $data["career_year"] * 12 + $data["career_month"];
    $data["height"] = (int)$data["height"];
    $data["weight"] = (int)$data["weight"];
    $data["strings_tension"] = (int)$data["strings_tension"];
    $n_medhist = [];
    if (isset($data["medhist"])) {
        foreach ($data["medhist"] as $i => $mh) {
            if ($mh["kind"] != "" && $mh["kind"] != 0) {
                $mh["period_year"] = (int)$mh["period_year"];
                $mh["period_month"] = (int)$mh["period_month"];
                $mh["period_month_total"] = $mh["period_year"] * 12 + $mh["period_month"];
                $n_medhist[] = $mh;
            }
        }
    }
    $data["medhist"] = $n_medhist;

    $n_pain = [];
    if (isset($data["pain"])) {
        foreach ($data["pain"] as $i => $mh) {
            if ($mh["kind"] != "" && $mh["kind"] != 0) {
                $mh["age_from"] = (int)$mh["age_from"];
                $mh["age_to"] = (int)$mh["age_to"];
                $n_pain[] = $mh;
            }
        }
    }
    $data["pain"] = $n_pain;

    $data["last_updated"] = date("Y/m/d H:i:s");

    $params = [
        "index" => ES_SHEET1,
        "type" => "_doc",
        "id" => $docid,
        "body" => $data
    ];
    $_SESSION["message"] = "大会前セルフチェックシートを更新しました。";

    $response = es_index($client, $params);

    putlog("[STAFF] Sheet1 updated: uid " . $data["uid"] . " staffid " . $uid);
    sleep(1);
    
    header('Content-Type: text/json');
    echo json_encode([
        "status" => "OK",
        "data" => $data
    ]);

} catch (Exception $e) {
    header('Content-Type: text/json');
    echo json_encode([
        "status" => "NG",
        "reason" => $e,
        "q" => $params
    ]);
    exit(0);
}
