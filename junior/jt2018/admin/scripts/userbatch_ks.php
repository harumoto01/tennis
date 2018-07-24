<?php
require "../../inc/conf.php";

$client = es_get_client();

for ($c = 1; $c <= 4; $c++) {
    $cat = $c*2+10;
    for ($i = 1; $i <= 64; $i++) {
        $n = $c*1000 + $i;
        $data["uid"] = "ks" . $n;
        $data["name"] = "選手　" . $n;
        $data["name_kana"] = "せんしゅ　" . $n;
        $data["gender"] = "m";
        $bd = new DateTime();
        $bd->setDate(2018-$cat, mt_rand(1,5), mt_rand(1, 28));
        $data["birthdate"] = $bd->format("Y/m/d 00:00:00");
        $data["club"] = "クラブ";
        $data["pref"] = (string)mt_rand(24,29);
        $data["category"] = (string)$cat;
    
        $data["password"] = hash("ripemd160", "kansaitest");
        $data["password_changed"] = ($i <= 32);
        $data["date"] = date("Y/m/d H:i:s");
        $data["last_updated"] = $data["date"];
        $params = [
            "index" => ES_PLAYERS,
            "type" => "_doc",
            "body" => $data
        ];
        echo $n;

        try {
            $response = es_index($client, $params);
        } catch (Exception $e) {
            echo json_encode([
                "status" => "NG",
                "reason" => $e,
                "q" => $params
            ]);
            exit(0);
        }

        unset($data);
        $n = $c*1000 + 100 + $i;
        $data["uid"] = "ks" . $n;
        $data["name"] = "選手　" . $n;
        $data["name_kana"] = "せんしゅ　" . $n;
        $data["gender"] = "f";
        $bd = new DateTime();
        $bd->setDate(2018-$cat, mt_rand(1,5), mt_rand(1, 28));
        $data["birthdate"] = $bd->format("Y/m/d 00:00:00");
        $data["club"] = "クラブ";
        $data["pref"] = (string)mt_rand(24,29);
        $data["category"] = (string)$cat;
    
        $data["password"] = hash("ripemd160", "kansaitest");
        $data["password_changed"] = ($i <= 32);
        $data["date"] = date("Y/m/d H:i:s");
        $data["last_updated"] = $data["date"];
        $params = [
            "index" => ES_PLAYERS,
            "type" => "_doc",
            "body" => $data
        ];
        echo $n;

        try {
            $response = es_index($client, $params);
        } catch (Exception $e) {
            echo json_encode([
                "status" => "NG",
                "reason" => $e,
                "q" => $params
            ]);
            exit(0);
        }
        
    }

}