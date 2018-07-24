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
    <title>試合当日セルフチェック</title>
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
  
    <form id="sheet2_form" method="POST" data-ajax="false">

      <div id="sheet2_p1" data-role="page">
	<input type="hidden" name="docid" id="docid" value="<?= $docid ?>" />
	<input type="hidden" name="date" id="date" />
	
	<div data-role="header" data-position="fixed" data-tap-toggle="false">
	  <h1>試合当日セルフチェック (1/2)</h1>
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
            <input type="range" name="sleep_usual" id="sleep_usual" data-highlight="true" data-popup-enabled="true" min="0" max="16" step="0.5" value="8">
          </div>

	  <div class="ui-field-contain">
            <label for="sleep_yesterday">昨日の睡眠時間</label>
            <input type="range" name="sleep_yesterday" id="sleep_yesterday" data-highlight="true" data-popup-enabled="true" min="0" max="16" step="0.5" value="8">
          </div>

          <div data-role="footer" data-tap-toggle="false">
	    <div class="ui-bar">
              <a href="menu.php" data-role="button" data-theme="b" data-icon="arrow-u" data-ajax="false">トップメニューへ戻る</a>
              <a href="#sheet2_p2" data-role="button" data-theme="b" data-icon="arrow-r" style="float:right" data-transition="slide">次へ</a>
	    </div>
          </div>
	</div>

      </div>
    
      <div id="sheet2_p2" data-role="page">

	<div data-role="header" data-position="fixed" data-tap-toggle="false">
	  <h1>試合当日セルフチェック (2/2)</h1>
	</div>
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
	<div class="ui-content" role="main">

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

	  <div class="ui-bar ui-bar-a ui-corner-all">確認事項</div>
          <label for="check">体調は自身で管理し、無理をして出場をすることはいたしません。</label><input type="checkbox" name="check" id="check" value="1" />
	</div>
	
        <div data-role="footer" data-tap-toggle="false">
	  <div class="ui-bar">
            <a href="#sheet2_p1" data-role="button" data-theme="b" data-icon="arrow-l" data-transition="slide" data-direction="reverse">戻る</a>
            <a href="#" id="sheet2_submit" data-role="button" data-theme="b" data-icon="check" style="float:right">入力終了</a>
          </div>
	</div>
      </div>
    
    </form>

  </body>
      
</html>
