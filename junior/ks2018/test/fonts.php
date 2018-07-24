<?php
require_once 'tcpdf.php';
$pdf = new TCPDF("L", "mm", "A4", true, "UTF-8" );
$pdf->setPrintHeader(false);
$pdf->setPrintFooter(false);
$pdf->AddPage();

$font1 = $pdf->addTTFfont('./fonts/ipag.ttf');
$pdf->SetFont($font1, '', 14);
$pdf->Text( 10, 10, "フォントを、IPAゴシック で表示" );

$font2 = $pdf->addTTFfont('./fonts/ipagp.ttf');
$pdf->SetFont($font2, '', 14);
$pdf->Text( 10, 20, "フォントを、IPA Pゴシックで表示" );

$font3 = $pdf->addTTFfont('./fonts/ipam.ttf');
$pdf->SetFont($font3, '', 14);
$pdf->Text( 10, 30, "フォントを、IPA明朝で表示" );

$font4 = $pdf->addTTFfont('./fonts/ipamp.ttf');
$pdf->SetFont($font4, '', 14);
$pdf->Text( 10, 40, "フォントを、IPA P明朝で表示" );
$pdf->Output("test.pdf", "I");
?>