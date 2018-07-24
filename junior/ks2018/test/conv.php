<?php
ini_set("memory_limit", "1G");
require "../inc/conf.php";

$client = es_get_client();

$params = [
    "index" => ES_DOCTOR_RECORD."_org",
    "body" => [
        "sort" => [
            "date" => "desc"
        ]
    ],
    "size" => 1000
    
];

$response = es_search($client, $params);

echo count($response["hits"]["hits"]);
//qexit(0);

$ori = [
    "undefined",
    "topleft",
    "topright",
    "bottomright",
    "bottomleft",
    "lefttop",
    "righttop",
    "rightbottom",
    "leftbottom"
];
$im = new Imagick();
foreach ($response["hits"]["hits"] as $hit) {
    $date = $hit["_source"]["date"];
    foreach ($hit["_source"]["s"] as $i => $s) {
        if (isset($s["photo_i"]) && count($s["photo_i"]) > 0) {
            foreach ($s["photo_i"] as $j => $pdata) {
                list($h,$b64img) = explode(",", $pdata, 2);
                $image = base64_decode($b64img);
                $im->readimageblob($image);
                $o = $im->getImageOrientation();
                switch ($o) {
                case 1:
                    $im->rotateImage("#000", 90);
                    break;
                case 3:
                    $im->rotateImage("#000", 180);
                    break;
                case 6:
                    $im->rotateImage("#000", 90);
                    break;
                case 8:
                    $im->rotateImage("#000", -90);
                    break;
                }
                $im->scaleImage(1200, 1200, true);
                $im->setImageFormat('jpeg');
//                $im->setImageCompressionQuality(100);
                $im->setImageOrientation(0);
                $b64img2 = base64_encode($im);
                $hit["_source"]["s"][$i]["photo_i"][$j] = "data:image/jpeg;base64," . $b64img2;
                echo $date . ": " . $ori[$o] . " ori=" . $o . " " . strlen($b64img2) . "<br/>";
                echo '<img src="data:image/jpeg;base64,'.$b64img2.'"><br/>';
            }
        }
        if (isset($s["photo_d"]) && count($s["photo_d"]) > 0) {
            foreach ($s["photo_d"] as $j => $pdata) {
                list($h,$b64img) = explode(",", $pdata, 2);
                $image = base64_decode($b64img);
                $im->readimageblob($image);
                $o = $im->getImageOrientation();
                switch ($o) {
                /* case 1: */
                /*     $im->rotateImage("#000", 90); */
                /*     break; */
                case 3:
                    $im->rotateImage("#000", 180);
                    break;
                case 6:
                    $im->rotateImage("#000", 90);
                    break;
                case 8:
                    $im->rotateImage("#000", -90);
                    break;
                }
                $im->scaleImage(1200, 1200, true);
                $im->setImageFormat('jpeg');
//                $im->setImageCompressionQuality(100);
                $im->setImageOrientation(0);
                $b64img2 = base64_encode($im);
                $hit["_source"]["s"][$i]["photo_d"][$j] = "data:image/jpeg;base64," . $b64img2;
                echo $date . ": " . $ori[$o] . " ori=" . $o . " " . strlen($b64img2) . "<br/>";
                echo '<img src="data:image/jpeg;base64,'.$b64img2.'"><br/>';
            }
        }
    }

    /* $params = [ */
    /*     "index" => ES_DOCTOR_RECORD, */
    /*     "type" => $hit["_type"], */
    /*     "id" => $hit["_id"], */
    /*     "body" => $hit["_source"] */
    /* ]; */

    /* es_index($client, $params); */
}

exit(0);
    
    