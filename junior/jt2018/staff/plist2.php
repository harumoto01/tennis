<?php
require "../inc/conf.php";

session_start();

if (!isset($_SESSION["uid"])) {
    $_SESSION["message"] = "タイムアウトのためログアウトしました。";
    header("Location: ../index.php");
    exit(0);
}
if (!isset($_SESSION["is_staff"]) || !$_SESSION["is_staff"]) {
    $_SESSION["message"] = "タイムアウトのためログアウトしました。";
    header("Location: ../index.php");
    exit(0);
}

if (isset($_SESSION["message"])) {
    $message = $_SESSION["message"];
    unset($_SESSION["message"]);
} else if (isset($message)) {
    unset($message);
}
if (isset($_SESSION["id"])) {
    unset($_SESSION["id"]);
}
if (isset($_SESSION["player_uid"])) {
    unset($_SESSION["player_uid"]);
}
?>
<!DOCTYPE html> 
<html>
  <head>
    <meta charset="utf-8">
    <title>選手一覧</title>
    <meta name="viewport" content="width=device-width, initial-scale=1"> 
    <link rel="stylesheet" href="../css/jquery.mobile-1.4.5.min.css" />
    <script src="../js/jquery-2.1.4.min.js"></script>
    <script src="../js/jquery.mobile-1.4.5.min.js"></script>
    <script src="../js/jquery.validate.js"></script>
    <script src="../js/common.js"></script>
    <script src="js/staff-plist2.js"></script>
    <link rel="stylesheet" href="css/staff-plist.css" />
  </head>

  <body>

    <div id="staff_plist" data-role="page">

      <div data-role="header" data-position="fixed" data-tap-toggle="false">
	<h1>選手一覧</h1>
	<a href="../logout.php" class="ui-btn ui-btn-b ui-btn-right ui-corner-all" data-ajax="false">ログアウト</a>
	<fieldset class="fsfilter" data-role="controlgroup" data-type="horizontal">
	  
	  <select name="sort_by" class="filter" data-inline="true" data-native-menu="false">
	    <option data-placeholder="true">ソート</option>
	    <option value="name_asc" selected="selected">氏名（昇順）</option>
	    <option value="name_desc">氏名（降順）</option>
	    <option value="cat_asc">階級（昇順）</option>
	    <option value="cat_desc">階級（降順）</option>
	  </select>

	  <select name="filter_category" class="filter" data-inline="true" data-native-menu="false" multiple="multiple">
	    <option data-placeholder="true">階級</option>
<?php
    foreach ($categories as $cid => $cname) {
        echo '            <option value="' . $cid . '">' . $cname . '</option>' . "\n";
    }
?>
	  </select>

	  <select name="filter_gender" class="filter" data-inline="true" data-native-menu="false" multiple="multiple">
	    <option data-placeholder="true">性別</option>
	    <option value="m">男</option>
	    <option value="f">女</option>
	  </select>

	  <select name="filter_check" class="filter" data-inline="true" data-native-menu="false" multiple="multiple">
	    <option data-placeholder="true">疾患</option>
	    <option value="md">内科疾患</option>
	    <option value="od">整形疾患</option>
	  </select>

	</fieldset>
	<button id="filter_clear" type="button" data-theme="b">クリア</button>

	<input id="key" data-type="search" data-inline="true" data-mini="true"/>

      </div>

      <div class="ui-content" role="main">

	<div id="staff_plist_list"></div>

      </div>

      <div data-role="footer" data-position="fixed" data-tap-toggle="false">
	<div class="ui-bar">
	  <a href="menu.php" data-role="button" data-theme="b" data-icon="back" data-ajax="false">トップページに戻る</a>
	</div>
      </div>

    </div>


    <div id="sheet1_p1" data-role="page">
      <form id="sheet1_form" data-ajax="false">

	<input type="hidden" name="uid" id="uid" />
	<input type="hidden" name="docid" id="docid" />
	<input type="hidden" name="date" id="date" />
	
	<div data-role="header" data-position="fixed" data-tap-toggle="false">
          <h1>大会前セルフチェック</h1>
	</div>

	<div class="ui-content" role="main">

          <div class="ui-bar ui-bar-a ui-corner-all">テニス競技歴等についてお尋ねします。</div>

          <div class="ui-field-contain">
            <label>テニス競技歴</label>
            <fieldset data-role="controlgroup" data-type="horizontal">
              <select name="career_year" id="career_year" data-native-menu="false">
              </select>
              <select name="career_month" id="career_month" data-native-menu="false">
		<option data-placeholder="true" value="-1">ケ月</option>
		<?php
		   for ($m = 0; $m <= 11; $m++) {
				      echo '                <option value="' . $m . '">' . $m . 'ケ月</option>' . "\n";
				      }
				      ?>
		   </select>
            </fieldset>
          </div>

          <div class="ui-field-contain">
            <label for="height">身長(cm)</label>
            <input type="range" name="height" id="height" data-highlight="true" data-popup-enabled="true" min="100" max="200" value="150">
          </div>

          <div class="ui-field-contain">
            <label for="weight">体重(kg)</label>
            <input type="range" name="weight" id="weight" data-highlight="true" data-popup-enabled="true" min="20" max="120" value="50">
          </div>

          <div class="ui-field-contain">
            <label for="racket">ラケットの種類</label>
            <select name="racket" id="racket" data-native-menu="false">
              <option data-placeholder="true" value="-1">ラケットの種類を選択</option>
	      <?php
		 foreach ($rackets as $i => $racket) {
	      ?>
              <option value="<?= $i ?>"><?= $racket ?></option>
	      <?php
		 }
		 ?>
            </select>
          </div>

          <div class="ui-field-contain">
            <label for="strings">ストリング</label>
            <select name="strings" id="strings" data-native-menu="false">
              <option data-placeholder="true" value="-1">ストリングを選択</option>
	      <?php
		 foreach ($strings as $i => $string) {
	      ?>
              <option value="<?= $i ?>"><?= $string ?></option>
	      <?php
		 }
		 ?>
            </select>
          </div>

          <div class="ui-field-contain">
            <label for="strings_tension">ストリングテンション（ポンド）</label>
            <input type="range" name="strings_tension" id="strings_tension" data-highlight="true" data-popup-enabled="true" min="30" max="70" value="50">
          </div>

          <div class="ui-field-contain">
            <label for="hand">利き手</label>
            <fieldset data-role="controlgroup" data-type="horizontal">
              <label><input type="radio" name="hand" value="r">　右手　</label>
              <label><input type="radio" name="hand" value="l">　左手　</label>
              <label><input type="radio" name="hand" value="b">　両手　</label>
            </fieldset>
          </div>

          <div class="ui-field-contain">
            <label for="forehand">フォアハンド</label>
	    <fieldset data-role="controlgroup" data-type="horizontal">
	      <label><input type="radio" name="forehand" value="r">　右手　</label>
	      <label><input type="radio" name="forehand" value="l">　左手　</label>
	    </fieldset>
            <label for="forehand_ob"></label>
	    <fieldset data-role="controlgroup" data-type="horizontal">
	      <label><input type="radio" name="forehand_ob" value="o">　片手　</label>
	      <label><input type="radio" name="forehand_ob" value="b">　両手　</label>
            </fieldset>
          </div>

	  <!--          <div class="ui-field-contain" style="display:inline !important">-->
          <div class="ui-field-contain">
            <label for="backhand_ob">バックハンド</label>
            <fieldset data-role="controlgroup" data-type="horizontal">
              <label><input type="radio" name="backhand_ob" value="o">　片手　</label>
              <label><input type="radio" name="backhand_ob" value="b">　両手　</label>
            </fieldset>
          </div>

          <div class="ui-bar ui-bar-a ui-corner-all">既往歴についてお尋ねします。</div>
	  <div id="medhist">
	  </div>
	  <div align="right" id="mad">
	    <button id="medhist_add" type="button" data-mini="true" data-inline="true" data-icon="plus" data-theme="b">追加</button>
	    <button id="medhist_del" type="button" data-mini="true" data-inline="true" data-icon="delete" data-theme="b">削除</button>

	  </div>

          <div class="ui-bar ui-bar-a ui-corner-all">アレルギーについてお尋ねします。</div>

          <div class="ui-field-contain">
            <label for="allergy[1][yn]">薬物アレルギー</label>
            <select name="allergy[1][yn]" index="1" class="s1allergy" data-native-menu="false">
	      　          <option value="0">ない</option>
              <option value="1">ある</option>
            </select>

            <label for="allergy[1][subject]"></label>
            <input type="text" name="allergy[1][subject]" index="1" class="s1allergy_subject" placeholder="薬品名">
          </div>

          <div class="ui-field-contain">
            <label for="allergy[2][yn]">食物アレルギー</label>
            <select name="allergy[2][yn]" index="2" class="s1allergy" data-native-menu="false">
	      　          <option value="0">ない</option>
              <option value="1">ある</option>
            </select>

            <label for="allergy[2][subject]"></label>
            <input type="text" name="allergy[2][subject]" index="2" class="s1allergy_subject" placeholder="食品名">

          </div>

          <div class="ui-field-contain">
            <label for="allergy[3][yn]">その他のアレルギー</label>
            <select name="allergy[3][yn]" index="3" class="s1allergy" data-native-menu="false">
	      <option value="0">ない</option>
              <option value="1">ある</option>
            </select>

            <label for="allergy[3][subject]"></label>
            <input type="text" name="allergy[3][subject]" index="3" class="s1allergy_subject" placeholder="アレルギーの対象">

          </div>

          <div class="ui-bar ui-bar-a ui-corner-all">痛みとケガについてお尋ねします。<br/>（２週間以上試合もしくは練習ができない程の痛み・ケガを入力して下さい。）</div>

	  <div id="pain">
	  </div>
	  
	  <div align="right" id="pad">
	    <button id="pain_add" type="button" data-mini="true" data-inline="true" data-icon="plus" data-theme="b">追加</button>
	    <button id="pain_del" type="button" data-mini="true" data-inline="true" data-icon="delete" data-theme="b">削除</button>

	  </div>

          <div class="ui-bar ui-bar-a ui-corner-all">病気についてお尋ねします。</div>

          <div class="ui-field-contain">
            <div class="ui-body ui-body-a ui-corner-all">
              現在、治療中や定期的に検査を受けている病気がありますか。
            </div>
            <select name="inquiry[1][yn]" id="inquiry[1][yn]" data-native-menu="false">
              <option value="0">ない</option>
              <option value="1">ある</option>
            </select>
	    <label for="inquiry[1][disname]">病名</label>
            <input type="text" name="inquiry[1][disname]" id="inquiry[1][disname]" placeholder="病名">
          </div>

          <div class="ui-field-contain">
            <div class="ui-body ui-body-a ui-corner-all">
              普段飲んでいる薬はありますか。
            </div>
            <select name="inquiry[2][yn]" data-native-menu="false">
              <option value="0">ない</option>
              <option value="1">ある</option>
            </select>
	    <label for="inquiry[2][medname]">薬の名前</label>
            <input type="text" name="inquiry[2][medname]" id="inquiry[2][medname]" placeholder="薬の名前">
	  </div>

	  <div class="ui-field-contain">
            <div class="ui-body ui-body-a ui-corner-all">
              これまでに練習中や試合中に意識を失ったことはありますか。
            </div>
            <select name="inquiry[3][age]" data-native-menu="false">
              <option value="-1">ない</option>
	      <?php
		 for ($y = 0; $y <= 18; $y++) {
				    echo '            <option value="' . $y . '">' . $y . '歳</option>' . "\n";
				    }
				    ?>
		 </select>
          </div>

	  <div class="ui-field-contain">
            <div class="ui-body ui-body-a ui-corner-all">
              学校検診で異常があったり、精密検査を受けたことがありますか。
            </div>
            <select name="inquiry[4][yn]" data-native-menu="false">
              <option value="0">ない</option>
              <option value="1">ある</option>
            </select>
	    <label for="inquiry[4][inspection]">検査内容</label>
            <input type="text" name="inquiry[4][inspection]" id="inquiry[4][inspection]" placeholder="検査内容">
	  </div>


	  <div class="ui-field-contain">
            <div class="ui-body ui-body-a ui-corner-all">
              何か気になる事などがあれば、記入してください。
            </div>
            <textarea name="inquiry[5][others]"></textarea> 
	  </div>

	  <div data-role="footer" data-tap-toggle="false">
	    <div class="ui-bar">
              <a href="#staff_sheet1" id="s1back" data-role="button" data-theme="b" data-icon="arrow-l" data-transition="slide" data-direction="reverse">戻る</a>
              <a href="#" id="sheet1_submit" data-role="button" data-theme="b" data-icon="check" style="float:right">修正終了</a>
            </div>
	  </div>
	</div>

      </form>

    </div>


    <div id="sheet2_p1" data-role="page">
      <form id="sheet2_form" data-ajax="false">

	<input type="hidden" name="docid" id="docid" />
	<input type="hidden" name="uid" id="uid" />
	<input type="hidden" name="date" id="date" />
	
	<div data-role="header" data-position="fixed" data-tap-toggle="false">
	  <h1>試合当日セルフチェック</h1>
	  <button class="ui-btn-right" type="button" id="s2regdate"></button>
	</div>

	<div class="ui-content" role="main">

	  <div class="ui-bar ui-bar-a ui-corner-all">今日の出場試合を教えてください。</div>

          <div class="ui-field-contain">
            <label for="category_s">出場カテゴリー<br>（シングルス）</label>
            <select name="category_s" id="category_s" data-native-menu="false" class="category">
              <option data-placeholder="true" value="">出場カテゴリー（シングルス）を選択</option>
              <option value="no">出場しない</option>
<?php
      foreach ($categories_s as $cid => $cname) {
          echo '              <option value="' . $cid . '">' . $cname . '</option>' . "\n";
      }
?>
            </select>
	  </div>
	  
	  <div class="ui-field-contain">
            <label for="category_d">出場カテゴリー<br>（ダブルス）</label>
            <select name="category_d" id="category_d" data-native-menu="false" class="category">
              <option data-placeholder="true" value="">出場カテゴリー（ダブルス）を選択</option>
              <option value="no">出場しない</option>
<?php
      foreach ($categories_d as $cid => $cname) {
          echo '              <option value="' . $cid . '">' . $cname . '</option>' . "\n";
      }
?>
            </select>
          </div>

	  <div class="ui-bar ui-bar-a ui-corner-all">現在の体調を教えてください。（あてはまるものにチェック）</div>

          <fieldset data-role="controlgroup" data-type="vertical">
<?php
    foreach ($phys_cond_inqs as $i => $inq) {
        if ($i >  0) {
            echo '            <label for="stat[' . $i . ']"><input type="checkbox" class="stat" name="stat[' . $i . ']" value="1">' . $inq . '</label>' . "\n";
        }
    }
?>
          </fieldset>

	  <div class="ui-field-contain">
            <label for="sleep_usual">普段の睡眠時間</label>
            <input type="range" name="sleep_usual" id="sleep_usual" data-highlight="true" data-popup-enabled="true" min="0" max="16" step="0.5">
          </div>

	  <div class="ui-field-contain">
            <label for="sleep_yesterday">昨日の睡眠時間</label>
            <input type="range" name="sleep_yesterday" id="sleep_yesterday" data-highlight="true" data-popup-enabled="true" min="0" max="16" step="0.5">
          </div>

      <!--     <div data-role="footer" data-tap-toggle="false"> -->
      <!-- 	    <div class="ui-bar"> -->
      <!--         <a href="menu.php" data-role="button" data-theme="b" data-icon="arrow-u" data-ajax="false">トップメニューへ戻る</a> -->
      <!--         <a href="#sheet2_p2" data-role="button" data-theme="b" data-icon="arrow-r" style="float:right" data-transition="slide">次へ</a> -->
      <!-- 	    </div> -->
      <!--     </div> -->
      <!-- 	</div> -->

      <!-- </div> -->
    
      <!-- <div id="sheet2_p2" data-role="page"> -->

      <!-- 	<div data-role="header" data-position="fixed" data-tap-toggle="false"> -->
      <!-- 	  <h1>試合当日セルフチェック (2/2)</h1> -->
      <!-- 	</div> -->
<?php
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
?>
	<!-- <div class="ui-content" role="main"> -->

          <div class="ui-bar ui-bar-a ui-corner-all">【現在】痛みがある部分をチェックしてください。</div>
	  <div class="ui-bar ui-bar-a ui-corner-all" style="text-align:center;background-color:#f0fff0;">
	    ① 全力で練習・試合ができない　② テニスはできるけど痛い　③ 遊べるけど痛い　④ 動かすと痛い　⑤ じっとしていても痛い
	  </div>

	  <br/>
	  <div class="bodybody">
	    <div class="bodyimg">
	      <img src="img/fig3f.png" height="413" draggable="false"/>
<?php
foreach ($pos_front as $i => list($y, $x)) {
?>
              <input type="hidden" data-role="none" class="part" name="pain_now[front][<?= $i+1 ?>]" id="part_pf<?= $i+1 ?>" value="0"><label class="mark" for="part_pf<?= $i+1 ?>" style="top: <?= $y ?>px;left: <?= $x ?>px"></label>
<?php    
}
?>
	    </div>
	    <div class="bodyimg">
              <img src="img/fig3b.png" height="413" draggable="false"/>
<?php
foreach ($pos_back as $i => list($y, $x)) {
?>
                <input type="hidden" data-role="none" class="part" name="pain_now[back][<?= $i+1 ?>]" id="part_pb<?= $i+1 ?>" value="0"><label class="mark" for="part_pb<?= $i+1 ?>" style="top: <?= $y ?>px;left: <?= $x ?>px"></label>
<?php    
}
?>
            </div>
	  </div>

	  <div class="ui-bar ui-bar-a ui-corner-all">【１ヶ月以内の痛み】痛みがある部分をチェックしてください。</div>
	  <div class="ui-bar ui-bar-a ui-corner-all" style="text-align:center;background-color:#f0fff0;">
	    ① 全力で練習・試合ができない　② テニスはできるけど痛い　③ 遊べるけど痛い　④ 動かすと痛い　⑤ じっとしていても痛い
	  </div>

	  <br/>
	  <div class="bodybody">
	    <div class="bodyimg">
	      <img src="img/fig3f.png" height="413" draggable="false"/>
<?php
foreach ($pos_front as $i => list($y, $x)) {
?>
              <input type="hidden" data-role="none" class="part" name="pain_past[front][<?= $i+1 ?>]" id="part_qf<?= $i+1 ?>" value="0"><label class="mark" for="part_qf<?= $i+1 ?>" style="top: <?= $y ?>px;left: <?= $x ?>px"></label>
<?php    
}
?>
	    </div>
	    <div class="bodyimg">
              <img src="img/fig3b.png" height="413" draggable="false"/>
<?php
foreach ($pos_back as $i => list($y, $x)) {
?>
              <input type="hidden" data-role="none" class="part" name="pain_past[back][<?= $i+1 ?>]" id="part_qb<?= $i+1 ?>" value="0"><label class="mark" for="part_qb<?= $i+1 ?>" style="top: <?= $y ?>px;left: <?= $x ?>px"></label>
<?php    
}
?>
            </div>

	  </div>

          <input type="hidden" name="check" id="check" />
	</div>
	
        <div data-role="footer" data-tap-toggle="false">
	  <div class="ui-bar">
            <a href="#" id="s2back" data-role="button" data-theme="b" data-icon="arrow-l" data-transition="slide" data-direction="reverse">戻る</a>
            <a href="#" id="sheet2_submit" data-role="button" data-theme="b" data-icon="check" style="float:right">修正終了</a>
          </div>
	</div>

      </form>
      
    </div>
    
  </body>

</html>
	       
