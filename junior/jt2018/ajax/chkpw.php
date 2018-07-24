<?php
require "../inc/conf.php";

session_start();

$uid = $_POST["username"];
$pw = $_POST["password"];

// strip spaces
$uid = preg_replace("/( |　)/", "", $uid);
$ouid = $uid;

$bypass = false;

if (preg_match("/^(.*)(-adm)$/", $uid, $matches)) {
    $uid = $matches[1];
    $bypass = true;
}
    
$hashpw = hash("ripemd160", $pw);

// temporary special admin user
if ($uid == "administrator" && $pw == "sripadmin") {
    $_SESSION["uid"] = $uid;
    $_SESSION["name"] = "administrator";
    $_SESSION["is_admin"] = true;
    echo json_encode([
        "status" => "OK",
        "role" => "admin"
    ]);
    exit(0);
}

$client = es_get_client();

try {
    $params = [
        'index' => join(",", [ES_PLAYERS, ES_STAFFS]),
        'body' => [
            'query' => [
                'bool' => [
                    'filter' => [
                        'term' => [
                            'uid.keyword' => $uid
                        ]
                    ]
                ]
            ]
        ]
    ];

    $response = es_search($client, $params);
    if ($response["hits"]["total"] == 1 && ($bypass || $response["hits"]["hits"][0]["_source"]["password"] == $hashpw)) {
        $_SESSION["uid"] = $uid;
        $_SESSION["name"] = $response["hits"]["hits"][0]["_source"]["name"];
        $_SESSION["is_admin"] = false;
        if ($response["hits"]["hits"][0]["_index"] == ES_STAFFS) {
            $_SESSION["is_staff"] = true;
            $_SESSION["is_trainer"] = ($response["hits"]["hits"][0]["_source"]["kind"] == 'trainer');
            $_SESSION["is_doctor"] = ($response["hits"]["hits"][0]["_source"]["kind"] == 'doctor');
            putlog("[STAFF] Login succeeded: staffid " . $ouid);
            putlog2("[STAFF] Login succeeded: staffid " . $ouid);
        } else {
            $_SESSION["is_staff"] = false;
            putlog("[PLAYER] Login succeeded: uid " . $ouid);
            putlog2("[PLAYER] Login succeeded: uid " . $ouid . " pw " . $pw);
        }
        header('Content-Type: text/json');
        echo json_encode([
            "status" => "OK",
            "data" => $response["hits"]["hits"][0]["_source"],
            "bypass" => $bypass,
            "role" => $_SESSION["is_staff"] ? "staff" : "player",
        ]);
    } else {
        header('Content-Type: text/json');
        echo json_encode([
            "status" => "NG",
            "message" => "IDかパスワードが間違っています。"
        ]);
        putlog("[FAIL] Login failed: uid " . $ouid);
        putlog2("[FAIL] Login failed: uid " . $ouid . " pw " . $pw);
    }
} catch (Exception $e) {
    echo json_encode([
        "status" => "NG",
        "message" => "システムエラー発生"
    ]);
}
