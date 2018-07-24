<?php
require "../../inc/conf.php";

session_start();

if (!isset($_SESSION["uid"])) {
    $_SESSION["message"] = "タイムアウトのためログアウトしました。";
    header("Location: ../index.php");
    exit(0);
}

$client = es_get_client();

$uid = $_SESSION["uid"];
$pw = $_POST["password1"];
$hashpw = hash("ripemd160", $pw);
if (isset($_POST["email"])) {
    $email = $_POST["email"];
}

$params = [
    "index" => ES_PLAYERS,
    "body" => [
        "query" => [
            "bool" => [
                "filter" => [
                    "term" => [
                        "uid.keyword" => $uid
                    ]
                ]
            ]
        ]
    ]
];

try {
    $response = es_search($client, $params);

    if ($response["hits"]["total"] != 1) {
        echo json_encode([
            "status" => "NG",
            "reason" => "player not found",
            "q" => $params
        ]);
        exit(0);
    }

    $id = $response["hits"]["hits"][0]["_id"];
    $data = $response["hits"]["hits"][0]["_source"];

    if ($data["password"] === $hashpw) {
        echo json_encode([
            "status" => "NG",
            "message" => "初期パスワードと同じパスワードは設定できません。"
        ]);
        exit(0);
    }

    $data["password"] = $hashpw;
    $data["password_changed"] = true;
    if (isset($email)) {
        $data["email"] = $email;
    }

    $params = [
        "index" => ES_PLAYERS,
        "type" => "_doc",
        "id" => $id,
        "body" => $data
    ];

    $response = es_index($client, $params);
    echo json_encode([
        "status" => "OK"
    ]);
    putlog("[PLAYER] Password changed: uid " . $uid);
    putlog2("[PLAYER] Password changed: uid " . $uid . " pw " . $pw);
} catch (Exception $e) {
    echo json_encode([
        "status" => "NG",
        "reason" => $e,
        "q" => $params
    ]);
    exit(0);
}

sleep(2);
