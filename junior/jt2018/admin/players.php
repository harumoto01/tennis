<?php
require "../inc/conf.php";

session_start();

if (!isset($_SESSION["uid"]) || !isset($_SESSION["is_admin"]) || !$_SESSION["is_admin"]) {
    $_SESSION["message"] = "タイムアウトのためログアウトしました。";
    header("Location: ../index.php");
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

?>
<!DOCTYPE html> 
<html>
  <head>
    <meta charset="utf-8">
    <title>ユーザ管理</title>
    <meta name="viewport" content="width=device-width, initial-scale=1"> 
    <link rel="stylesheet" href="../css/jquery.mobile-1.4.5.min.css" />
    <script src="../js/jquery-2.1.4.min.js"></script>
    <script src="../js/jquery.mobile-1.4.5.min.js"></script>
    <script src="../js/jquery.validate.js"></script>
    <script src="../js/common.js"></script>
    <script src="js/admin-players.js"></script>
    <link rel="stylesheet" href="css/admin-players.css" />
  </head>

  <body>

    <div id="admin_players" data-role="page">

      <div data-role="header" data-position="fixed" data-top-toggle="false">
	<h1>選手一覧</h1>
	<a href="../logout.php" data-theme="b" class="ui-btn-right" data-ajax="false">ログアウト</a>
      </div>
      
      <div class="ui-content" role="main">

        <form class="ui-filterable">
  	  <input id="key" data-type="search" />
	</form>

	<div id="admin_players_list">
	</div>

      </div>
      
      <div data-role="footer" data-position="fixed" data-tap-toggle="false">
	<div class="ui-bar">
	  <a href="menu.php" data-theme="b" data-icon="back" data-ajax="false">トップページに戻る</a>
	    &nbsp;&nbsp;
	  <a class="playeradd" data-theme="b" data-icon="plus" style="float:right;">選手データ追加</a>
	</div>
      </div>
    </div>


    <!-- playeradd -->
    <div id="admin_playeradd" data-role="page">

      <div data-role="header" data-position="fixed" data-top-toggle="false">
	<h1>選手データ<span id="editoradd"><span></h1>
	<a href="#" data-role="button" data-theme="b" data-icon="check" class="ui-btn-right form_submit" data-ajax="false"><span id="editoraddbtn"></span></a>
      </div>
      
      <div class="ui-content" role="main">

	<form id="admin_playeradd_form">
	  <input type="hidden" name="id" id="id" />
	  <input type="hidden" name="date" id="date" />

	  <div class="ui-field-contain">
	    <label for="uid">選手ID</label>
	    <input type="text" id="uid" name="uid" placeholder="選手ID">
	  </div>

	  <div class="ui-field-contain">
	    <label for="name">氏名</label>
	    <input type="text" id="name" name="name" placeholder="氏名">
	  </div>

	  <div class="ui-field-contain">
	    <label for="name_kana">ふりがな</label>
	    <input type="text" id="name_kana" name="name_kana" placeholder="氏名かな">
	  </div>

          <div class="ui-field-contain">
            <label for="gender">性別</label>
            <fieldset data-role="controlgroup" data-type="horizontal">
              <label><input type="radio" name="gender" value="m">　男　</label>
              <label><input type="radio" name="gender" value="f">　女　</label>
            </fieldset>
          </div>
	  
          <div class="ui-field-contain">
            <label>生年月日</label>
            <fieldset data-role="controlgroup" data-type="horizontal">
              <select name="birth_year" id="birth_year" data-native-menu="false">
		<option data-placeholder="true" value="">年</option>
<?php
  $thisyear = date("Y");
  for ($y = $thisyear; $y >= $thisyear - 20; $y--) {
    echo '            <option value="' . $y . '">' . $y . '年</option>' . "\n";
  }
?>
              </select>
              <select name="birth_month" id="birth_month" data-native-menu="false">
		<option data-placeholder="true" value="">月</option>
<?php
  for ($m = 1; $m <= 12; $m++) {
    echo '            <option value="' . $m . '">' . $m . '月</option>' . "\n";
  }
?>
              </select>
              <select name="birth_day" id="birth_day" data-native-menu="false">
		<option data-placeholder="true" value="">日</option>
<?php
  for ($d = 1; $d <= 31; $d++) {
    echo '           <option value="' . $d . '">' . $d . '日</option>' . "\n";
  }
?>
              </select>
            </fieldset>
          </div>

	  <!-- <div class="ui-field-contain"> -->
          <!--   <label for="birthdate">生年月日</label> -->
          <!--   <input type="text" id="birthdate" name="birthdate" placeholder="生年月日を入力" /> -->
          <!-- </div> -->

          <!-- <div class="ui-field-contain"> -->
          <!--   <label for="school">学校名</label> -->
          <!--   <input type="text" id="school" name="school" placeholder="学校名を入力" /> -->
          <!-- </div> -->

          <div class="ui-field-contain">
            <label for="club">所属</label>
            <input type="text" id="club" name="club" placeholder="所属を入力" />
          </div>

          <div class="ui-field-contain">
            <label for="pref">都道府県</label>
            <select name="pref" id="pref" data-native-menu="false">
              <option data-placeholder="true" value="">選択してください</option>
<?php
  foreach ($areas as $area => $p) {
?>
              <optgroup label="<?php echo $area; ?>">
<?php
  foreach ($p as $i) {
?>
                <option value="<?= $i ?>"><?= $prefs[$i] ?></option>
<?php
  }
?>		 
	      </optgroup>
<?php
}
?>
            </select>
          </div>

          <div class="ui-field-contain">
            <label for="category">カテゴリー</label>
            <fieldset data-role="controlgroup" data-type="horizontal">
<?php
    foreach ($categories as $cid => $cname) {
        echo '<label><input type="radio" name="category" value="' . $cid . '">' . $cname . '</label>' . "\n";
    }
?>                                              
            </fieldset>
          </div>
	    
          <div class="ui-field-contain">
            <label for="password">パスワード</label>
	    <input type="password" name="password" id="password" placeholder="パスワード">
	  </div>
	  
	  <div class="ui-field-contain">
	    <label for="password_changed">要パスワード変更</label>
	    <input data-role="flipswitch" type="checkbox" name="password_changed" id="password_changed" data-on-text="要" data-off-text="不要" data-wrapper-class="custom-label-flipswitch" value="0">
	  </div>

          <div class="ui-field-contain">
            <label for="email">メールアドレス</label>
            <input type="text" id="email" name="email" placeholder="メールアドレスを入力" />
          </div>
      
	</form>
	
      </div>

      <div data-role="footer" data-position="fixed" data-tap-toggle="false">
	<div class="ui-bar">
	  <a href="players.php" data-role="button" data-theme="b" data-icon="back" data-transition="slide" data-direction="reverse">選手管理に戻る</a>
	</div>
      </div>

    </div>

  </body>

</html>

  
    
	       
