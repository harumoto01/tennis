<?php
require "../inc/conf.php";
require_once "tcpdf.php";

session_start();

if (!isset($_SESSION["uid"]) || !isset($_POST["docid"])) {
    $message = "タイムアウトのためログアウトしました。";
    header("Location: ../index.php");
    exit(0);
}
$uid = $_SESSION["uid"];
$name = $_SESSION["name"];
$docid = $_POST["docid"];

$client = es_get_client();
$params = [
    "index" => join(",", [ES_PLAYERS, ES_SHEET1, ES_SHEET2]),
    "body" => [
        "query" => [
            "bool" => [
                "filter" => [
                    "term" => [
                        "uid.keyword" => $uid
                    ]
                ]
            ]
        ],
        "_source" => [
            "includes" => [
                "*"
            ],
            "excludes" => [
                "password*"
            ]
        ]
    ]
];

try {
    $response = es_search($client, $params);

    foreach ($response["hits"]["hits"] as $hit) {
        if ($hit["_index"] == ES_PLAYERS) {
            $pd = $hit["_source"];
        } else if ($hit["_index"] == ES_SHEET1) {
            $s1d = $hit["_source"];
        } else if ($hit["_index"] == ES_SHEET2 && $hit["_id"] == $docid) {
            $s2d = $hit["_source"];
        }
    }
    $today = (int)date("Ymd");
    $bd = (int)date("Ymd", strtotime($pd["birthdate"]));
    $age = (int)(($today - $bd)/10000);
    

    // generate PDF
    $pdf = new TCPDF("P", "mm", "A4", true, 'UTF-8');

    $pdf->setFontSubsetting(true);

    $pdf->SetCreator(PDF_CREATOR);
    $pdf->SetTitle("関西ジュニアテニス選手権");

    $pdf->SetPrintHeader(false);
    $pdf->SetPrintFooter(false);
    $pdf->SetFooterMargin(0);
    $pdf->SetMargins(18,10,18);
    $pdf->SetAutoPageBreak(false, 0);

    $pdf->AddPage();

    $pdf->SetFont("ipagp",'',18);
    $pdf->Write(20, "セルフチェックシート（試合当日）", "", 0, "C", true, 0, false, false, 0);

    $pdf->SetFont("ipamp",'',11);

    $pdf->SetFillColor(224,224,224);
    $pdf->SetDrawColor(0,0,0);
    $pdf->SetTextColor(0);
    $pdf->Cell(30, 8, "記入日", 1, 0, "C", true);
    $pdf->Cell(140, 8, substr($s2d["date"],0,16), 1, 0, "L", false);
    $pdf->Ln();
    $pdf->Cell(30, 8, "氏　名", 1, 0, "C", true);
    $pdf->Cell(140, 8, $pd["name"] . "　（" . $pd["name_kana"] . "）", 1, 0, "L", false);
    $pdf->Ln();
    $pdf->Cell(30, 8, "年齢・性別", 1, 0, "C", true);
    $pdf->Cell(55, 8, $age . "歳・" . $genders[$pd["gender"]], 1, 0, "L", false);
    $pdf->Cell(30, 8, "身長・体重", 1, 0, "C", true);
    $pdf->Cell(55, 8, isset($s1d) ? ($s1d["height"] . " cm ・ " . $s1d["weight"] . " kg") : "", 1, 0, "L", false);
    $pdf->Ln();
    $pdf->Cell(30, 8, "所　属", 1, 0, "C", true);
    $pdf->Cell(140, 8, $pd["club"], 1, 0, "L", false, '', 1);
    $pdf->Ln();
    $pdf->Cell(30, 8, "テニス競技歴", 1, 0, "C", true);
    $pdf->Cell(140, 8, isset($s1d) ? ($s1d["career_year"] . "年 " . $s1d["career_month"] . "ヶ月") : "", 1, 0, "L", false);
    $pdf->Ln();
    $pdf->Cell(30, 8, "ラケットの種類", 1, 0, "C", true, '', 1);
    $pdf->Cell(55, 8, isset($s1d) ? $rackets[$s1d["racket"]] : "", 1, 0, "L", false, '', 1);
    $pdf->Cell(30, 8, "ストリングス", 1, 0, "C", true);
    $pdf->Cell(55, 8, isset($s1d) ? ($strings[$s1d["strings"]] . "・" . $s1d["strings_tension"] . " ポンド") : "", 1, 0, "L", false, '', 1);
    $pdf->Ln();
    $pdf->Cell(30, 8, "利き手", 1, 0, "C", true, '', 1);
    $pdf->Cell(25, 8, isset($s1d) ? (($s1d["hand"] == "r" ? "右手" : ($s1d["hand"] == "l" ? "左手" : ($s1d["hand"] == "b" ? "両手" : "")))) : "", 1, 0, "L", false, '', 1);
    $pdf->Cell(30, 8, "フォアハンド", 1, 0, "C", true, '', 1);
    $pdf->Cell(30, 8, isset($s1d) ? (($s1d["forehand"] == "r" ? "右手・" : ($s1d["forehand"] == "l" ? "左手・" : "")) . 
    ($s1d["forehand_ob"] == "o" ? "片手" : ($s1d["forehand_ob"] == "b" ? "両手" : ""))) : "", 1, 0, "L", false, '', 1);
    $pdf->Cell(30, 8, "バックハンド", 1, 0, "C", true, '', 1);
    $pdf->Cell(25, 8, isset($s1d) ? (($s1d["backhand_ob"] == "o" ? "片手" : ($s1d["backhand_ob"] == "b" ? "両手" : ""))) : "", 1, 0, "L", false, '', 1);

    $pdf->Ln();
    $pdf->Ln();

    $pdf->Cell(30, 8, "本日の出場試合", 1, 0, "C", true);
    $cat = [];
    if ($s2d["category_s"] != "no") {
        $cat[] = $categories_s[$s2d["category_s"]];
    }
    if ($s2d["category_d"] != "no") {
        $cat[] = $categories_d[$s2d["category_d"]];
    }
    $pdf->Cell(140, 8, join("・", $cat), 1, 0, "L", false);
    $pdf->Ln();
    
    $pdf->Cell(30, 8*(count($phys_cond_inqs)-1), "本日の体調", 1, 0, "C", true);

    foreach ($phys_cond_inqs as $i => $str) {
        if ($i > 1) {
            $pdf->Cell(30, 8, "", 0, 0, "C", false); //skip
        }
        if ($i > 0) {
            $pdf->Cell(110, 8, $str, 1, 0, "L", false);
            if (isset($s2d["stat"][$i])) {
                $pdf->Cell(30, 8, "は　い", 1, 0, "C", true);
            } else {
                $pdf->Cell(30, 8, "いいえ", 1, 0, "C", false);
            }
            $pdf->Ln();
        }
    }
    

    $pdf->Cell(30, 8, "睡眠時間", 1, 0, "C", true);
    $pdf->Cell(140, 8, $s2d["sleep_yesterday"] . "時間　（普段 " . $s2d["sleep_usual"] . "時間）", 1, 0, "L", false);
    $pdf->Ln();
    $pdf->Ln();

    $pdf->Cell(85, 8, "現在痛みがある部位", 1, 0, "C", false);
    $pdf->Cell(85, 8, "１ヶ月以内で痛みがある部位", 1, 0, "C", false);
    $pdf->Ln();
    $pdf->Cell(85, 83, "", 1, 0, "C", false);
    $pdf->Cell(85, 83, "", 1, 0, "C", false);

    $pdf->Image("../player/img/fig3f.png", 25, 205, 0, 69);
    $pdf->Image("../player/img/fig3b.png", 65, 205, 0, 69);
    $pdf->Image("../player/img/fig3f.png", 110, 205, 0, 69);
    $pdf->Image("../player/img/fig3b.png", 150, 205, 0, 69);

    $pdf->SetFont("ipag",'',11);

    $pos_front = [
        [0,79],
        [70,34],[110,31],[150,24],[187,16],[225,6],
        [70,122],[110,125],[150,132],[187,140],[225,150],
        [100,79],[150,79],
        [205,57],[243,57],[285,58],[325,58],[365,60],[395,53],
        [205,101],[243,101],[285,100],[325,100],[365,98],[395,105]
    ];
    $pos_back = [
        [0,82],
        [70,36],[70,125],
        [100,82],[170,82],
        [250,62],[310,62],
        [250,102],[310,102]
    ];

    foreach ($pos_front as $i => list($y, $x)) {
        $xx = $x * 0.171+ 26.7;
        $yy = $y * 0.171 + 206.5;
        if ($s2d["pain_now"]["front"][$i+1] > 0) {
            $pdf->Circle($xx, $yy, 2, 0, 360, 'DF', [], [230,230,230]);
            $pdf->Text($xx-2, $yy-2.2, $s2d["pain_now"]["front"][$i+1]);
        } else {
            $pdf->Circle($xx, $yy, 2, 0, 360, 'DF', [], [255,255,255]);
        }
        if ($s2d["pain_past"]["front"][$i+1] > 0) {
            $pdf->Circle($xx+85, $yy, 2, 0, 360, 'DF', [], [230,230,230]);
            $pdf->Text($xx+85-2, $yy-2.2, $s2d["pain_past"]["front"][$i+1]);
        } else {
            $pdf->Circle($xx+85, $yy, 2, 0, 360, 'DF', [], [255,255,255]);
        }
    }

    foreach ($pos_back as $i => list($y, $x)) {
        $xx = $x * 0.171+ 66.7;
        $yy = $y * 0.171 + 206.5;
        if ($s2d["pain_now"]["back"][$i+1] > 0) {
            $pdf->Circle($xx, $yy, 2, 0, 360, 'DF', [], [230,230,230]);
            $pdf->Text($xx-2, $yy-2.3, $s2d["pain_now"]["back"][$i+1]);
        } else {
            $pdf->Circle($xx, $yy, 2, 0, 360, 'DF', [], [255,255,255]);
        }
        if ($s2d["pain_past"]["back"][$i+1] > 0) {
            $pdf->Circle($xx+85, $yy, 2, 0, 360, 'DF', [], [230,230,230]);
            $pdf->Text($xx+85-2, $yy-2.3, $s2d["pain_past"]["back"][$i+1]);
        } else {
            $pdf->Circle($xx+85, $yy, 2, 0, 360, 'DF', [], [255,255,255]);
        }
    }

    $pdf->Output("sheet2.pdf", "D");

//    print_r($response);
} catch (Exception $e) {
    echo "データ取得に失敗しました。";
//    print_r($e);
    exit(0);
}
