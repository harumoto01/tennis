<?php
require "../../inc/conf.php";

session_start();

if (!isset($_SESSION["uid"]) || !isset($_SESSION["is_admin"]) || !$_SESSION["is_admin"]) {
    $_SESSION["message"] = "タイムアウトのためログアウトしました。";
    header("Location: index.php");
}

$data["kind"] = $_POST["kind"];
$data["uid"] = $_POST["uid"];
$data["name"] = $_POST["name"];
$data["name_kana"] = $_POST["name_kana"];
$data["gender"] = $_POST["gender"];

try {
    $client = es_get_client();
    
    if (isset($_POST["id"]) && $_POST["id"] != "") {
        $id = $_POST["id"];
        $params = [
            "index" => ES_STAFFS,
            "type" => "_doc",
            "id" => $id
        ];
        $response = es_get($client, $params);
        $old_uid = $response["_source"]["uid"];
        $data["date"] = $response["_source"]["date"];
        $data["last_updated"] = date("Y/m/d H:i:s");
        if ($_POST["password"] != "") {
            $data["password"] = hash("ripemd160", $_POST["password"]);
        } else {
            $data["password"] = $response["_source"]["password"];
        }

        $params = [
            "index" => ES_STAFFS,
            "type" => "_doc",
            "id" => $id,
            "body" => $data
        ];

        $response = es_index($client, $params);

        if ($data["uid"] != $old_uid) {  // uid is changed
            $params = [
                "index" => join(",", [ES_TRAINER_RECORD, ES_DOCTOR_RECORD]),
                "body" => [
                    "query" => [
                        "bool" => [
                            "filter" => [
                                "term" => [
                                    "treatment_uid.keyword" => $old_uid
                                ]
                            ]
                        ]
                    ]
                ]
            ];

            $resp2 = es_search($client, $params);

            foreach ($resp2["hits"]["hits"] as $hit) {
                $hit["_source"]["treatment_uid"] = $data["uid"];
                $params = [
                    "index" => $hit["_index"],
                    "type" => $hit["_type"],
                    "id" => $hit["_id"],
                    "body" => $hit["_source"]
                ];
                es_index($client, $params);
            }

        }
        sleep(1);
        echo json_encode([
            "status" => "OK",
            "data" => $data
        ]);
        
        putlog("[ADMIN] Staff data updated: staffid " . $data["uid"]);
        
    } else {  // insert
        
        $data["password"] = hash("ripemd160", $_POST["password"]);
        $data["date"] = date("Y/m/d H:i:s");
        $data["last_updated"] = $data["date"];
        $params = [
            "index" => ES_STAFFS,
            "type" => "_doc",
            "body" => $data
        ];

        $response = es_index($client, $params);

        sleep(1);
        echo json_encode([
            "status" => "OK",
            "data" => $data
        ]);

        putlog("[ADMIN] Staff data inserted: staffid " . $data["uid"]);
        
    }

} catch (Exception $e) {
    echo json_encode([
        "status" => "NG",
        "reason" => $e,
        "q" => $params
    ]);
    exit(0);
}
