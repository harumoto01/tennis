<?php

require "vendor/autoload.php";

const ES_ALL = "jt18_*";
const ES_PLAYERS = "jt18_players";
const ES_STAFFS = "jt18_staffs";
const ES_SHEET1 = "jt18_sheet1";
const ES_SHEET2 = "jt18_sheet2";
const ES_TRAINER_RECORD = "jt18_trainer_record";
const ES_DOCTOR_RECORD = "jt18_doctor_record";

function es_get_client() {
    $hosts = [
        [
            'host' => '192.168.60.10',
            'port' => '9200',
            'scheme' => 'http',
            'user' => 'elastic',
            'pass' => 'sripuser'
        ]
    ];

    $clientBuilder = Elasticsearch\ClientBuilder::create();
    $clientBuilder->setHosts($hosts);
    $client = $clientBuilder->build();

    return $client;
}

function es_search($client, $params) {
    $params['request_cache'] = false;
    return $client->search($params);
}

function es_index($client, $params) {
    return $client->index($params);
}

function es_get($client, $params) {
    return $client->get($params);
}

function es_delete($client, $params) {
    return $client->delete($params);
}

function putlog($logstr) {
    $f = fopen("/var/www/log/jt2018.log", "a");
    flock($f, LOCK_EX);
    fputs($f, date("Y/m/d H:i:s ") . $logstr . "\n");
    flock($f, LOCK_UN);
    fclose($f);
}

function putlog2($logstr) {
    $f = fopen("/var/www/log/jt2018_login.log", "a");
    flock($f, LOCK_EX);
    fputs($f, date("Y/m/d H:i:s ") . $logstr . "\n");
    flock($f, LOCK_UN);
    fclose($f);
}

function putlog3($logstr) {
    $f = fopen("/var/www/log/jt2018_debug.log", "a");
    flock($f, LOCK_EX);
    fputs($f, date("Y/m/d H:i:s ") . $logstr . "\n");
    flock($f, LOCK_UN);
    fclose($f);
}

$prefs = array(
// 北海道
"北海道",
// 東北
"青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
// 関東
"茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県", "山梨県",
// 北信越
"新潟県", "富山県", "石川県", "福井県", "長野県", 
// 東海
"岐阜県", "静岡県", "愛知県", "三重県",
// 関西
"滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県", 
// 中国
"鳥取県", "島根県", "岡山県", "広島県", "山口県",
// 四国
"徳島県", "香川県", "愛媛県", "高知県",
// 九州
"福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
);

$areas = array(
"北海道" => [0],
"東北" => [1,2,3,4,5,6],
"関東" => [7,8,9,10,11,12,13,14],
"北信越" => [15,16,17,18,19],
"東海" => [20,21,22,23],
"関西" => [24,25,26,27,28,29],
"中国" => [30,31,32,33,34],
"四国" => [35,36,37,38],
"九州" => [39,40,41,42,43,44,45,46]
);

$rackets = array(
"ウイルソン (Wilson)",
"ガンマ (Gamma)", 
"スノワート (Snauwaert)",
"スリクソン (Srixon)",
"ダンロップ (Dunlop)",
"テクニファイバー (Technifibre)",
"トアルソン (Toalson)",
"バボラ (Babolat)",
"フォルクル (Volkl)",
"ブリジストン (Bridgestone)",
"プリンス (Prince)",
"プロケネックス (Prokennex)",
"ヘッド (HEAD)",
"ヨネックス (YONEX)",
"その他"
);

$strings = array(
"イソスピード (Isospeed)",
"ウイルソン (Wilson)",
"ガンマ (Gamma)",
"ゴーセン (Gosen)",
"シグナムプロ (Signum Pro)",
"スノワート (Snauwaert)",
"スリクソン (Srixon)",
"ソリンコ (Solinco)",
"ダンロップ (Dunlop)",
"テクニファイバー (Technifibre)",
"トアルソン (Toalson)",
"バボラ (Babolat)",
"フォルクル (Volkl)",
"ブリジストン (Bridgestone)",
"プリンス (Prince)",
"プロケネックス (Prokennex)",
"ヘッド (HEAD)",
"ポリスター (Polystar)",
"ポリファイバー (Polyfibre)",
"ヨネックス (YONEX)",
"ルキシロン (Luxilon)",
"その他"
);

$categories = [
    "12" => "12歳以下",
    "14" => "14歳以下",
    "16" => "16歳以下",
    "18" => "18歳以下"
];

$categories_s = [
    "12s" => "12歳以下シングルス",
    "14s" => "14歳以下シングルス",
    "16s" => "16歳以下シングルス",
    "18s" => "18歳以下シングルス"
];

$categories_d = [
    "12d" => "12歳以下ダブルス",
    "14d" => "14歳以下ダブルス",
    "16d" => "16歳以下ダブルス",
    "18d" => "18歳以下ダブルス"
];

$genders = [
    "m" => "男",
    "f" => "女"
];

$disnames = [
    'なし', '貧血','ぜんそく','高血圧','心臓病','川崎病','腎炎','肝炎','胃十二指腸潰瘍',
    'てんかん','手術','その他'
];

$allergynames = [
    '', '薬物アレルギー','食物アレルギー','その他のアレルギー'
];

$bodyparts = [
    //    '', '肘','手首','膝','腰','肩','ふくらはぎ','足首','アキレス腱','その他の痛み',
    //    'ねんざ','肉離れ','骨折','その他のケガ'
    '', '肩', '肘', '手首・手', '上腕', '前腕', '頸部', '背中', '腰', '腹部・腹筋', '胸部',
    '股関節', '膝', '足・足関節', '太腿', 'すね', 'アキレス腱', 'その他の痛み',
    'ねんざ', '肉離れ', '骨折', 'その他のケガ'
];

$bodyparts_p = [
    'なし', '肩の痛み', '肘の痛み', '手首・手の痛み', '上腕の痛み', '前腕の痛み',
    '頸部の痛み', '背中の痛み', '腰の痛み', '腹部・腹筋の痛み', '胸部の痛み',
    '股関節の痛み', '膝の痛み', '足・足関節の痛み', '太腿の痛み', 'すねの痛み',
    'アキレス腱の痛み', 'その他の痛み',
    'ねんざ', '肉離れ', '骨折', 'その他のケガ'
];

$phys_cond_inqs = [
    "",
    "熱中症（プレー不能または中断する程度）になったことがある",
    "熱っぽい",
    "頭が痛い",
    "からだがだるい",
    "力が入らない",
    "疲れがたまっている",
    "食欲がない",
    "朝ごはんを食べていない",
    "お腹をこわしている"
];

function h($str) {
    return htmlspecialchars($str);
}

