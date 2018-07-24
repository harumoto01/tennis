<?php
require "../../inc/conf.php";

session_start();

if (!isset($_SESSION["uid"])) {
    echo json_encode([
        "status" => "NG",
        "message" => "タイムアウトしました。"
    ]);
    exit(0);
}

$client = es_get_client();

$uid = $_SESSION["uid"];
putlog3("put_sheet1 start " . $uid);
putlog3(print_r($_POST, true));

$data = $_POST;
if (isset($data["docid"])) {
    $docid = $data["docid"];
    unset($data["docid"]);
} else {
    $docid = "";
}

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

if ($docid != "") {
    $data["last_updated"] = date("Y/m/d H:i:s");
    $params = [
        "index" => ES_SHEET1,
        "type" => "_doc",
        "id" => $docid,
        "body" => $data
    ];
    $_SESSION["message"] = "大会前セルフチェックシートを更新しました。";
    putlog("[PLAYER] Sheet1 updated: uid " . $uid);
} else {
    $data["date"] = date("Y/m/d H:i:s");
    $data["last_updated"] = $data["date"];
    $params = [
        "index" => ES_SHEET1,
        "type" => "_doc",
        "body" => $data
    ];
    $_SESSION["message"] = "大会前セルフチェックシートを登録しました。";
    putlog("[PLAYER] Sheet1 inserted: uid " . $uid);
}

try{
    $response = es_index($client, $params);
} catch (Exception $e) {
    echo json_encode([
        "status" => "NG",
        "reason" => $e,
        "q" => $params
    ]);
    exit(0);
}

sleep(2);
echo json_encode($response);

putlog3("put_sheet1 end " . $uid);
putlog3(print_r($data, true));
