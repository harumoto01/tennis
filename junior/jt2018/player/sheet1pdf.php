<?php
require "../inc/conf.php";
require_once "tcpdf.php";

session_start();

if (!isset($_SESSION["uid"])) {
    $message = "タイムアウトのためログアウトしました。";
    header("Location: ../index.php");
    exit(0);
}

$uid = $_SESSION["uid"];

try {
    $client = es_get_client();

    $params = [
        "index" => join(",", [ES_PLAYERS, ES_SHEET1]),
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
                "excludes" => [
                    "password*"
                ]
            ]
        ]
    ];

    $response = es_search($client, $params);

    foreach ($response["hits"]["hits"] as $hit) {
        if ($hit["_index"] == ES_PLAYERS) {
            $pd = $hit["_source"];
        } else if ($hit["_index"] == ES_SHEET1) {
            $s1d = $hit["_source"];
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
    $pdf->Write(20, "セルフチェックシート（大会前）", "", 0, "C", true, 0, false, false, 0);

    $pdf->SetFont("ipamp",'',11);

    $pdf->SetFillColor(224,224,224);
    $pdf->SetDrawColor(0,0,0);
    $pdf->SetTextColor(0);
    $pdf->Cell(30, 8, "記入日", 1, 0, "C", true);
    $pdf->Cell(140, 8, substr($s1d["date"],0,16), 1, 0, "L", false);
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

    if (!isset($s1d["medhist"]) || count($s1d["medhist"]) == 0) {
        $pdf->Cell(30, 8, "既往歴", 1, 0, "C", true, "", 1);
        $pdf->Cell(140, 8, "なし", 1, 0, "L", false, "", 1);
        $pdf->Ln();
    } else {
        $pdf->Cell(30, 8*count($s1d["medhist"]), "既往歴", 1, 0, "C", true, "", 1);
        foreach ($s1d["medhist"] as $i => $mh) {
            if ($i > 0) {
                $pdf->Cell(30, 8, "", 0, 0, "L", false, "", 0);
            }
            $pdf->Cell(140, 8, $disnames[$mh["kind"]]."（".$mh["age"]."歳, ".$mh["period_year"]."年".$mh["period_month"]."ヶ月）", 1, 0, "L", false, "", 1);
            $pdf->Ln();
        }
    }

    foreach ($s1d["allergy"] as $i => $al) {
        $pdf->Cell(30, 8, $allergynames[$i], 1, 0, "C", true, "", 1);
        if ($al["yn"] == 1) {
            $pdf->Cell(140, 8, "あり（".$al["subject"]."）", 1, 0, "L", false, "", 1);
        } else {
            $pdf->Cell(140, 8, "なし", 1, 0, "L", false, "", 1);
        }
        $pdf->Ln();
    }
    
    if (!isset($s1d["pain"]) || count($s1d["pain"]) == 0) {
        $pdf->Cell(30, 8, "痛み・ケガ", 1, 0, "C", true, "", 1);
        $pdf->Cell(140, 8, "なし", 1, 0, "L", false, "", 1);
        $pdf->Ln();
    } else {
        $pdf->Cell(30, 8*count($s1d["pain"]), "痛み・ケガ", 1, 0, "C", true, "", 1);
        foreach ($s1d["pain"] as $i => $ph) {
            if ($i > 0) {
                $pdf->Cell(30, 8, "", 0, 0, "L", false, "", 0);
            }
            if ($ph["kind"] >= 16) {
                $pdf->Cell(140, 8, $bodyparts_p[$ph["kind"]]."（".$ph["part"].", ".$ph["age_from"]."歳〜".($ph["age_to"] == 999 ? "現在）" : ($ph["age_to"]."歳）")), 1, 0, "L", false, "", 1);
            } else {
                $pdf->Cell(140, 8, $bodyparts_p[$ph["kind"]]."（".$ph["age_from"]."歳〜".($ph["age_to"] == 999 ? "現在）" : ($ph["age_to"]."歳）")), 1, 0, "L", false, "", 1);
            }
            $pdf->Ln();
        }
    }

    $pdf->Cell(30, 8, "現在治療中の病気", 1, 0, "C", true, "", 1);
    $pdf->Cell(140, 8, $s1d["inquiry"][1]["yn"] == 1 ? $s1d["inquiry"][1]["disname"] : "なし", 1, 0, "L", false, "", 1);
    $pdf->Ln();

    $pdf->Cell(30, 8, "普段飲んでいる薬", 1, 0, "C", true, "", 1);
    $pdf->Cell(140, 8, $s1d["inquiry"][2]["yn"] == 1 ? $s1d["inquiry"][2]["medname"] : "なし", 1, 0, "L", false, "", 1);
    $pdf->Ln();

    $pdf->Cell(30, 8, "意識を失った経験", 1, 0, "C", true, "", 1);
    $pdf->Cell(140, 8, $s1d["inquiry"][3]["age"] != -1 ? $s1d["inquiry"][3]["age"]."歳" : "なし", 1, 0, "L", false, "", 1);
    $pdf->Ln();

    $pdf->Cell(30, 8, "健診・精密検査", 1, 0, "C", true, "", 1);
    $pdf->Cell(140, 8, $s1d["inquiry"][4]["yn"] == 1 ? $s1d["inquiry"][4]["inspection"] : "なし", 1, 0, "L", false, "", 1);
    $pdf->Ln();

    $pdf->Cell(30, 24, "その他気になること等", 1, 0, "C", true, "", 1);
    $pdf->MultiCell(140, 24, $s1d["inquiry"][5]["others"] != "" ? $s1d["inquiry"][5]["others"] : "なし", 1, "L", false);
    $pdf->Ln();

    
    $pdf->Output("sheet1.pdf", "D");


} catch (Exception $e) {
    echo "データ取得に失敗しました。";
    print_r($e);
    exit(0);
}
