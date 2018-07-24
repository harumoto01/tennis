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

$uid = $_SESSION["uid"];
$player_uid = $_SESSION["player_uid"];

$client = es_get_client();

$data = $_POST;
$data["treatment_uid"] = $uid;
$data["uid"] = $player_uid;

if ($_SESSION["is_trainer"]) {
    $sindex = ES_TRAINER_RECORD;
} else if ($_SESSION["is_doctor"]) {
    $sindex = ES_DOCTOR_RECORD;
}

$photo_del = false;
foreach ($data["s"] as $index => $d) {
    if ($d["kind"] == 0) {
        if (isset($d["photo_i_del"]) && count($d["photo_i_del"]) > 0) {
            $del_i[$index] = $d["photo_i_del"];
            $photo_del = true;
        }
        unset($data["s"][$index]["photo_i"]);
        unset($data["s"][$index]["photo_i_del"]);
    } else {
        if (isset($d["photo_d_del"]) && count($d["photo_d_del"]) > 0) {
            $del_d[$index] = $d["photo_d_del"];
            $photo_del = true;
        }
        unset($data["s"][$index]["photo_d"]);
        unset($data["s"][$index]["photo_d_del"]);
    }

    $data["s"][$index]["daysorweeks"] = (int)$data["s"][$index]["daysorweeks"];
    if ($data["s"][$index]["dw_unit"] == "d") {
        $data["s"][$index]["interrupt_days"] = $data["s"][$index]["daysorweeks"];
    } else {
        $data["s"][$index]["interrupt_days"] = $data["s"][$index]["daysorweeks"] * 7;
    }
}

$rphoto = [];

if (isset($data["docid"])) {
    $params = [
        "index" => $sindex,
        "type" => "_doc",
        "id" => $data["docid"]
    ];
    try {
        $response = es_get($client, $params);
    } catch (Exception $e) {
        echo json_encode([
            "status" => "NG",
            "reason" => $e,
            "q" => $params
        ]);
        exit(0);
    }
    $odata = $response["_source"];
    foreach ($odata["s"] as $index => $sheet) {
        if (isset($sheet["photo_i"])) {
            foreach ($sheet["photo_i"] as $c => $photo) {
                if (!isset($del_i[$index]) || !in_array($c, $del_i[$index])) {
                    $rphoto[$index]["photo_i"][] = $photo;
                }
            }
        }
        if (isset($sheet["photo_d"])) {
            foreach ($sheet["photo_d"] as $c => $photo) {
                if (!isset($del_d[$index]) || !in_array($c, $del_d[$index])) {
                    $rphoto[$index]["photo_d"][] = $photo;
                }
            }
        }
    }
}

if (isset($_FILES["s"])) {
    foreach ($_FILES["s"]["tmp_name"] as $index => $photo) {
        foreach ($photo as $pkind => $filearr) {
            foreach ($filearr as $i => $tmpfile) {
                if ($_FILES["s"]["error"][$index][$pkind][$i] == 0) {
                    $type = $_FILES["s"]["type"][$index][$pkind][$i];
                    $b64 = base64_encode(file_get_contents($tmpfile));
                    $rphoto[$index][$pkind][] = "data:" . $type . ";base64," . $b64;
//                    $data["s"][$index][$pkind][$i] = "data:" . $type . ";base64," . $b64;
                }
            }
        }
    }
}

foreach ($rphoto as $index => $photo) {
    foreach ($photo as $pkind => $parr) {
        $data["s"][$index][$pkind] = $parr;
    }
}

if (isset($data["docid"])) {
    $docid = $data["docid"];
    unset($data["docid"]);
    $data["last_updated"] = date("Y/m/d H:i:s");
    $params = [
        "index" => $sindex,
        "type" => "_doc",
        "id" => $docid,
        "body" => $data
    ];

    try{
        $response = es_index($client, $params);
    } catch (Exception $e) {
        echo json_encode([
            "status" => "NG",
            "reason" => $e
//        "q" => $params
        ]);
        exit(0);
    }
    unset($_SESSION["id"]);
    $_SESSION["message"] = "対応シートを更新しました。";
    putlog("[STAFF] Treatment record updated: uid " . $player_uid . " staffid " . $uid);
} else {
    $data["date"] = date("Y/m/d H:i:s");
    $data["last_updated"] = $data["date"];
    $params = [
        "index" => $sindex,
        "type" => "_doc",
        "body" => $data
    ];

    try{
        $response = es_index($client, $params);
    } catch (Exception $e) {
        echo json_encode([
            "status" => "NG",
            "reason" => $e
//            "q" => $params
        ]);
        exit(0);
    }
    $_SESSION["message"] = "対応シートを登録しました。";
    putlog("[STAFF] Treatment record inserted: uid " . $player_uid . " staffid " . $uid);
}

sleep(2);
echo json_encode($response);
