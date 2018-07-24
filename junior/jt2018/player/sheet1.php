<?php
require "../inc/conf.php";

session_start();

if (!isset($_SESSION["uid"])) {
    $message = "タイムアウトのためログアウトしました。";
    header("Location: ../index.php");
    exit(0);
}
$uid = $_SESSION["uid"];
$name = $_SESSION["name"];

if (isset($_POST["docid"])) {
    $docid = $_POST["docid"];
    $_SESSION["docid"] = $docid;
} else if (isset($_SESSION["docid"])) {
    $docid = $_SESSION["docid"];
} else {
    $docid = "";
}
   
?>
<!DOCTYPE html> 
<html>
  <head>
    <meta charset="utf-8">
    <title>大会前セルフチェック</title>
    <meta name="viewport" content="width=device-width, initial-scale=1"> 
    <link rel="stylesheet" href="../css/jquery.mobile-1.4.5.min.css" />
    <script src="../js/jquery-2.1.4.min.js"></script>
    <script src="../js/jquery.mobile-1.4.5.min.js"></script>
    <script src="../js/jquery.validate.js"></script>
    <script src="../js/common.js"></script>
    <script src="js/player-common.js"></script>
    <link rel="stylesheet" href="css/player-common.css" />
  </head>

  <body>

    <form id="sheet1_form" data-ajax="false">

      <!-- p1 -->
      <div id="sheet1_p1" data-role="page">
	<input type="hidden" name="uid" id="uid" value="<?= $uid ?>" />
	<input type="hidden" name="docid" id="docid" value="<?= $docid ?>" />
	<input type="hidden" name="date" id="date" />
      
        <div data-role="header" data-position="fixed" data-tap-toggle="false">
          <h1>大会前セルフチェック (1/4)<br/>基本データ</h1>
	</div>

	<div class="ui-content" role="main">

          <div class="ui-bar ui-bar-a ui-corner-all">テニス競技歴等についてお尋ねします。</div>

          <div class="ui-field-contain">
            <label>テニス競技歴</label>
            <fieldset data-role="controlgroup" data-type="horizontal">
              <select name="career_year" id="career_year" data-native-menu="false">
<!--
		<option data-placeholder="true" value="-1">年</option>
<?php
  for ($y = 0; $y <= 18; $y++) {
    echo '                <option value="' . $y . '">' . $y . '年</option>' . "\n";
  }
?>
-->
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

	</div>  
        <div data-role="footer" data-tap-toggle="false">
	  <div class="ui-bar">
            <a href="menu.php" data-role="button" data-theme="b" data-icon="arrow-u" data-ajax="false">トップメニューへ戻る</a>
            <a href="#sheet1_p2" data-role="button" data-theme="b" data-icon="arrow-r" style="float:right" data-transition="slide">次へ</a>
	  </div>
        </div>

      </div>
    
    
      <!-- p2 -->
      <div data-role="page" id="sheet1_p2">

	<div data-role="header" data-position="fixed" data-tap-toggle="false">
          <h1>大会前セルフチェック (2/4)<br/>既往歴</h1>
	</div>

	<div class="ui-content" role="main">

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
	</div>
        <div data-role="footer" data-tap-toggle="false">
	  <div class="ui-bar">
            <a href="#sheet1_p1" data-role="button" data-theme="b" data-icon="arrow-l" data-transition="slide" data-direction="reverse">戻る</a>
            <a href="#sheet1_p3" data-role="button" data-theme="b" data-icon="arrow-r" style="float:right" data-transition="slide">次へ</a>
	  </div>
        </div>

      </div>

      <!-- p3 -->
      <div data-role="page" id="sheet1_p3">

	<div data-role="header" data-position="fixed" data-tap-toggle="false">
          <h1>大会前セルフチェック (3/4)<br/>痛みとケガ</h1>
	</div>

	<div class="ui-content" role="main">

          <div class="ui-bar ui-bar-a ui-corner-all">痛みとケガについてお尋ねします。<br/>（２週間以上試合もしくは練習ができない程の痛み・ケガを入力して下さい。）</div>

	  <div id="pain">
	  </div>
	  
	  <div align="right" id="pad">
	    <button id="pain_add" type="button" data-mini="true" data-inline="true" data-icon="plus" data-theme="b">追加</button>
	    <button id="pain_del" type="button" data-mini="true" data-inline="true" data-icon="delete" data-theme="b">削除</button>

	  </div>

	</div>
	
        <div data-role="footer" data-tap-toggle="false">
	  <div class="ui-bar">
            <a href="#sheet1_p2" data-role="button" data-theme="b" data-icon="arrow-l" data-transition="slide" data-direction="reverse">戻る</a>
            <a href="#sheet1_p4" data-role="button" data-theme="b" data-icon="arrow-r" style="float:right" data-transition="slide">次へ</a>
	  </div>
        </div>

      </div>


      <!-- p4 -->
      <div data-role="page" id="sheet1_p4">

	<div data-role="header" data-position="fixed" data-tap-toggle="false">
          <h1>大会前セルフチェック (4/4)<br/>その他</h1>
	</div>

	<div class="ui-content" role="main">

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

	</div>

	<div data-role="footer" data-tap-toggle="false">
	  <div class="ui-bar">
            <a href="#sheet1_p3" data-role="button" data-theme="b" data-icon="arrow-l" data-transition="slide" data-direction="reverse">戻る</a>
	    <a href="#" id="sheet1_submit" data-role="button" data-theme="b" data-icon="check" style="float:right">入力終了</a>
	  </div>
	</div>

      </div>

    </form>

  </body>

</html>
