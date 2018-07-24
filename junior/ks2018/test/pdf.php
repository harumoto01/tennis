<?php
require_once "tcpdf.php";

$pdf = new TCPDF("P", "mm", "A4", true, 'UTF-8');

$pdf->setFontSubsetting(true);

$pdf->SetCreator(PDF_CREATOR);
$pdf->SetTitle("関西ジュニアテニス大会");

$pdf->SetPrintHeader(false);
$pdf->SetPrintFooter(false);
$pdf->SetFooterMargin(0);
$pdf->SetMargins(18,10,18);
$pdf->SetAutoPageBreak(false, 0);

$pdf->AddPage();

$pdf->SetFont("ipagp",'',18);
$pdf->Write(20, "セルフチェックシート（試合当日）", "", 0, "C", true, 0, false, false, 0);

/* $pdf->SetFont("ipam",'',12); */
/* $pdf->Write(0, "記入日：　2018/06/14 09:24", "", false, "L", true); */
/* $pdf->Write(0, "氏　名：　春本　茜　（はるもと　あかね）", "", false, "L", true); */
/* $pdf->Write(0, "所　属：　-", "", false, "L", true); */
/* $pdf->Write(0, "学校名：　神戸女学院中等部", "", false, "L", true); */
/* $pdf->Write(0, "年　齢：　14 歳", "", false, "L", true); */
/* $pdf->Write(0, "本日の出場試合：　14歳以下シングルス", "", false, "L", true); */
/* $pdf->Write(0, "テニス競技歴：　3年8ヶ月", "", false, "L", true); */
/* $pdf->Write(0, "身　長：　154 cm　　体　重：　40 kg", "", false, "L", true); */

/* $pdf->Ln(); */

$pdf->SetFont("ipamp",'',11);

$pdf->SetFillColor(224,224,224);
$pdf->SetDrawColor(0,0,0);
$pdf->SetTextColor(0);
$pdf->Cell(30, 8, "記入日", 1, 0, "C", true);
$pdf->Cell(140, 8, "2018/06/14 09:24", 1, 0, "L", false);
$pdf->Ln();
$pdf->Cell(30, 8, "氏　名", 1, 0, "C", true);
$pdf->Cell(140, 8, "春本　茜　（はるもと　あかね）", 1, 0, "L", false);
$pdf->Ln();
$pdf->Cell(30, 8, "年齢・性別", 1, 0, "C", true);
$pdf->Cell(55, 8, "14歳・女", 1, 0, "L", false);
$pdf->Cell(30, 8, "身長・体重", 1, 0, "C", true);
$pdf->Cell(55, 8, "154 cm ・ 40 kg", 1, 0, "L", false);
$pdf->Ln();
$pdf->Cell(30, 8, "所　属", 1, 0, "C", true);
$pdf->Cell(140, 8, "テニスクラブ神戸", 1, 0, "L", false, '', 1);
//$pdf->Cell(30, 8, "学校名", 1, 0, "C", true);
//$pdf->Cell(55, 8, "神戸女学院中等部あいうえおかきくけこ", 1, 0, "L", false, '', 1);
$pdf->Ln();
$pdf->Cell(30, 8, "テニス競技歴", 1, 0, "C", true);
$pdf->Cell(140, 8, "3年 8ヶ月", 1, 0, "L", false);
$pdf->Ln();
$pdf->Cell(30, 8, "ラケットの種類", 1, 0, "C", true, '', 1);
$pdf->Cell(55, 8, "スリクソン(Srixon)", 1, 0, "L", false, '', 1);
$pdf->Cell(30, 8, "ストリングス", 1, 0, "C", true);
$pdf->Cell(55, 8, "スリクソン(Srixon)・50ポンド", 1, 0, "L", false, '', 1);
$pdf->Ln();
$pdf->Cell(30, 8, "利き手", 1, 0, "C", true, '', 1);
$pdf->Cell(25, 8, "右手", 1, 0, "L", false, '', 1);
$pdf->Cell(30, 8, "フォアハンド", 1, 0, "C", true, '', 1);
$pdf->Cell(30, 8, "右手・片手", 1, 0, "L", false, '', 1);
$pdf->Cell(30, 8, "バックハンド", 1, 0, "C", true, '', 1);
$pdf->Cell(25, 8, "片手", 1, 0, "L", false, '', 1);

$pdf->Ln();
$pdf->Ln();

$pdf->Cell(30, 8, "本日の出場試合", 1, 0, "C", true);
$pdf->Cell(140, 8, "14歳以下シングルス", 1, 0, "L", false);
$pdf->Ln();
$pdf->Cell(30, 72, "本日の体調", 1, 0, "C", true);

$pdf->Cell(100, 8, "熱中症になったことがある", 1, 0, "L", false);
$pdf->Cell(40, 8, "は　い", 1, 0, "C", true);
$pdf->Ln();
$pdf->Cell(30, 8, "", 0, 0, "C", false); //skip
$pdf->Cell(100, 8, "熱っぽい", 1, 0, "L", false);
$pdf->Cell(40, 8, "は　い", 1, 0, "C", true);
$pdf->Ln();
$pdf->Cell(30, 8, "", 0, 0, "C", false); //skip
$pdf->Cell(100, 8, "頭が痛い", 1, 0, "L", false);
$pdf->Cell(40, 8, "いいえ", 1, 0, "C", false);
$pdf->Ln();
$pdf->Cell(30, 8, "", 0, 0, "C", false); //skip
$pdf->Cell(100, 8, "からだがだるい", 1, 0, "L", false);
$pdf->Cell(40, 8, "は　い", 1, 0, "C", true);
$pdf->Ln();
$pdf->Cell(30, 8, "", 0, 0, "C", false); //skip
$pdf->Cell(100, 8, "力が入らない", 1, 0, "L", false);
$pdf->Cell(40, 8, "は　い", 1, 0, "C", true);
$pdf->Ln();
$pdf->Cell(30, 8, "", 0, 0, "C", false); //skip
$pdf->Cell(100, 8, "疲れがたまっている", 1, 0, "L", false);
$pdf->Cell(40, 8, "は　い", 1, 0, "C", true);
$pdf->Ln();
$pdf->Cell(30, 8, "", 0, 0, "C", false); //skip
$pdf->Cell(100, 8, "食欲がない", 1, 0, "L", false);
$pdf->Cell(40, 8, "いいえ", 1, 0, "C", false);
$pdf->Ln();
$pdf->Cell(30, 8, "", 0, 0, "C", false); //skip
$pdf->Cell(100, 8, "朝ごはんを食べていない", 1, 0, "L", false);
$pdf->Cell(40, 8, "は　い", 1, 0, "C", true);
$pdf->Ln();
$pdf->Cell(30, 8, "", 0, 0, "C", false); //skip
$pdf->Cell(100, 8, "お腹をこわしている", 1, 0, "L", false);
$pdf->Cell(40, 8, "いいえ", 1, 0, "C", false);
$pdf->Ln();

$pdf->Cell(30, 8, "睡眠時間", 1, 0, "C", true);
$pdf->Cell(140, 8, "7.5時間　（普段 8時間）", 1, 0, "L", false);
$pdf->Ln();
$pdf->Ln();

$pdf->Cell(85, 8, "現在痛みがある部位", 1, 0, "C", false);
$pdf->Cell(85, 8, "以前から痛みがある部位", 1, 0, "C", false);
$pdf->Ln();
$pdf->Cell(85, 83, "", 1, 0, "C", false);
$pdf->Cell(85, 83, "", 1, 0, "C", false);

$pdf->Image("../player/img/fig3f.png", 25, 205, 30);
$pdf->Image("../player/img/fig3b.png", 65, 205, 30);
$pdf->Image("../player/img/fig3f.png", 110, 205, 30);
$pdf->Image("../player/img/fig3b.png", 150, 205, 30);

$pdf->SetFont("ipag",'',11);
$pdf->Circle(40, 205, 2, 0, 360, 'DF', [], [230,230,230]);
$pdf->Text(38, 202.8, "4");
$pdf->Output("hoge.pdf", "I");
