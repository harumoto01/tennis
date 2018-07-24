const es_all = 'jt18_*';
const es_players = 'jt18_players';
const es_staffs = 'jt18_staffs';
const es_sheet1 = 'jt18_sheet1';
const es_sheet2 = 'jt18_sheet2';
const es_trainer_record = 'jt18_trainer_record';
const es_doctor_record = 'jt18_doctor_record';

const prefs = [
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
];

const ages = {
    'now': '現在',
    0: '0歳',
    1: '1歳',
    2: '2歳',
    3: '3歳',
    4: '4歳',
    5: '5歳',
    6: '6歳',
    7: '7歳',
    8: '8歳',
    9: '9歳',
    10: '10歳',
    11: '11歳',
    12: '12歳',
    13: '13歳',
    14: '14歳',
    15: '15歳',
    16: '16歳',
    17: '17歳',
    18: '18歳'
};

const rackets = [
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
];

const strings = [
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
];

const disnames = [
    'なし', '貧血','ぜんそく','高血圧','心臓病','川崎病','腎炎','肝炎','胃十二指腸潰瘍',
    'てんかん','手術','その他'
];

const allergynames = [
    '', '薬物アレルギー','食物アレルギー','その他'
];

const bodyparts = [
    //    '', '肘','手首','膝','腰','肩','ふくらはぎ','足首','アキレス腱','その他の痛み',
    //    'ねんざ','肉離れ','骨折','その他のケガ'
    '', '肩', '肘', '手首・手', '上腕', '前腕', '頸部', '背中', '腰', '腹部・腹筋', '胸部',
    '股関節', '膝', '足・足関節', '太腿', 'すね', 'アキレス腱', 'その他の痛み',
    'ねんざ', '肉離れ', '骨折', 'その他のケガ'
];

const bodyparts_p = [
    'なし', '肩の痛み', '肘の痛み', '手首・手の痛み', '上腕の痛み', '前腕の痛み',
    '頸部の痛み', '背中の痛み', '腰の痛み', '腹部・腹筋の痛み', '胸部の痛み',
    '股関節の痛み', '膝の痛み', '足・足関節の痛み', '太腿の痛み', 'すねの痛み',
    'アキレス腱の痛み', 'その他の痛み',
    'ねんざ', '肉離れ', '骨折', 'その他のケガ'
];

const statstrs = [
    '',
    '熱中症になったことがある',
    '熱っぽい',
    '頭が痛い',
    'からだがだるい',
    '力が入らない',
    '疲れがたまっている',
    '食欲がない',
    '朝ごはんを食べていない',
    'お腹をこわしている'
];

const categories = {
    '12': '12歳以下',
    '14': '14歳以下',
    '16': '16歳以下',
    '18': '18歳以下'
};

const categories_s = {
    '12s': '12歳以下シングルス',
    '14s': '14歳以下シングルス',
    '16s': '16歳以下シングルス',
    '18s': '18歳以下シングルス'
};

const categories_d = {
    '12d': '12歳以下ダブルス',
    '14d': '14歳以下ダブルス',
    '16d': '16歳以下ダブルス',
    '18d': '18歳以下ダブルス'
};

const genders = {
    'm': '男',
    'f': '女'
};

//
const injury_parts = {
    1: '顔（目、耳、鼻も含む）',
    2: '頭',
    3: '頚と頚椎',
    4: '胸椎と背部',
    5: '肋骨と胸骨',
    6: '腰椎と腰部',
    7: '腹部',
    8: '骨盤、仙骨、臀部',
    11: '肩、鎖骨',
    12: '上腕',
    13: '肘',
    14: '前腕',
    15: '手関節',
    16: '手',
    17: '指（母指除く）',
    18: '母指',
    21: '股関節',
    22: '鼠径部',
    23: '大腿部',
    24: '膝',
    25: '下腿',
    26: 'アキレス腱',
    27: '足関節',
    28: '足部／足趾'
};

const injuries = {
    1: '脳振とう（意識消失含む）',
    2: '骨折（外傷によるもの）',
    3: '疲労骨折',
    4: 'その他の骨傷',
    5: '脱臼、亜脱臼',
    6: '腱断裂',
    7: '靭帯断裂',
    8: '捻挫（関節もしくは靭帯）',
    9: '半月板や軟骨損傷',
    10: '筋挫傷／筋断裂／断裂',
    11: '挫傷・打撲痛／血腫／皮下血腫',
    12: '腱炎／腱鞘炎／付着部炎',
    13: '関節炎／滑膜炎／滑液包炎',
    14: '筋膜炎／腱膜損傷',
    15: 'インピンジメント',
    16: '裂傷／擦過傷／皮膚傷害（マメ・タコ含む）',
    17: '歯のトラブル（歯折損含む）',
    18: '神経損傷／脊髄損傷',
    19: '筋痙攣／筋攣縮',
    20: 'その他',
    21: '筋疲労／筋硬縮'
};

const injury_causes = {
    1: 'オーバーユース（徐々に発生）',
    2: 'オーバーユース（突然発生）',
    3: '非接触性外傷',
    4: '以前のケガの再発',
    11: '接触：他のプレーヤー',
    12: '接触：移動するもの（例：パック）',
    13: '接触：動かないもの（例：ボール）',
    14: '違反行為によって',
    21: 'フィールドの状態のため',
    22: '気候のため',
    23: '装具の不具合',
    24: 'その他'
};

const treatmentstr = {
    1: 'アイシング',
    2: 'ストレッチ',
    3: 'テーピング',
    4: '応急処置',
    5: 'その他'
};
    
const organs = {
    1: '呼吸器／耳、鼻、のど',
    2: '消化器',
    3: '泌尿器',
    4: '心血管系',
    5: 'アレルギー／免疫反応',
    6: '代謝／内分泌',
    7: '血液学的',
    8: '神経／精神学的',
    9: '皮膚科',
    10: '筋骨格',
    11: '歯科',
    12: 'その他',
    13: '熱中症'
};

const diseases = {
    1: '発熱',
    2: '痛み',
    3: '下痢、嘔吐',
    4: '呼吸困難、咳',
    5: '動悸',
    6: '高体温',
    7: '低体温',
    8: '脱水',
    9: '失神、失調',
    10: '過敏症（アナフィラキシー）',
    11: '嗜眠、めまい',
    12: 'その他',
    13: '熱中症'
};

const disease_causes = {
    1: '以前からあるもの（例:喘息）',
    2: '感染',
    3: '運動誘発性',
    4: '環境要因（熱中症含む）',
    5: '薬物反応',
    6: 'その他'
};

const kinds = {
    'trainer': 'トレーナー',
    'doctor': 'ドクター'
};


function h(str) {
    if (typeof str !== 'string') {
	return str;
    }
    return str.replace(/[&'`"<>]/g, function(match) {
	return {
	    '&': '&amp;',
	    "'": '&#x27;',
	    '`': '&#x60;',
	    '"': '&quot;',
	    '<': '&lt;',
	    '>': '&gt;'
	}[match];
    });
}

// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function(searchElement, fromIndex) {

      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      // 1. Let O be ? ToObject(this value).
      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If len is 0, return false.
      if (len === 0) {
        return false;
      }

      // 4. Let n be ? ToInteger(fromIndex).
      //    (If fromIndex is undefined, this step produces the value 0.)
      var n = fromIndex | 0;

      // 5. If n ≥ 0, then
      //  a. Let k be n.
      // 6. Else n < 0,
      //  a. Let k be len + n.
      //  b. If k < 0, let k be 0.
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      function sameValueZero(x, y) {
        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
      }

      // 7. Repeat, while k < len
      while (k < len) {
        // a. Let elementK be the result of ? Get(O, ! ToString(k)).
        // b. If SameValueZero(searchElement, elementK) is true, return true.
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }
        // c. Increase k by 1. 
        k++;
      }

      // 8. Return false
      return false;
    }
  });
}

var objValues = function(obj) {
    return Object.keys(obj).map(function(e) { return obj[e]; });
};
