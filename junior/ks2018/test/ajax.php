<?php
require "../inc/conf.php";

session_start();
//echo json_encode($_POST);
//exit(0);
if (!(isset($_POST["csrf_token"]) && $_POST["csrf_token"] === $_SESSION["csrf_token"])) {
    echo '{"name":"BAD"}';
    exit(0);
}
$client = es_get_client();

$params = [
    "index" => "srip-users",
    "type" => "user",
    "body" => [
        "query" => [
            "bool" => [
                "must" => [
                    "match_all" => (object)[]
                ],
                "filter" => [
                    "term" => [
                        "uid.keyword" => $_POST["uid"]
                    ]
                ]
            ]
        ]
    ]
];

try{
    $response = es_search($client, $params);
} catch (Exception $e) {
    print_r($e);
    exit(1);
}

header('Content-Type: text/json');
print_r(json_encode($response["hits"]["hits"][0]["_source"]));
