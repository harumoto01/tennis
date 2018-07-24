<?php
require "../inc/conf.php";

session_start();

if (!isset($_SESSION["uid"])) {
    $_SESSION["message"] = "タイムアウトのためログアウトしました。";
    header("Location: ../index.php");
}
if (!isset($_SESSION["is_admin"]) || !$_SESSION["is_admin"]) {
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
    <script src="js/admin-staffs.js"></script>
    <link rel="stylesheet" href="css/admin-staffs.css" />
  </head>

  <body>

    <div id="admin_staffs" data-role="page">

      <div data-role="header" data-position="fixed" data-top-toggle="false">
	<h1>スタッフ一覧</h1>
	<a href="../logout.php" class="ui-btn ui-btn-b ui-btn-right ui-corner-all" data-ajax="false">ログアウト</a>
      </div>
      
      <div class="ui-content" role="main">

        <form class="ui-filterable">
  	  <input id="key" data-type="search" />
	</form>

	<div id="admin_staffs_list">
	</div>

	<div data-role="footer" data-position="fixed" data-tap-toggle="false">
	  <div class="ui-bar">
	    <a href="menu.php" data-role="button" data-theme="b" data-icon="back" data-ajax="false">トップページに戻る</a>
	    &nbsp;&nbsp;
	    <a href="#" class="staffadd" data-role="button" data-theme="b" data-icon="plus" style="float:right;">スタッフデータ追加</a>
	  </div>
	</div>
      </div>

    </div>


    <!-- staffadd -->
    <div id="admin_staffadd" data-role="page">

      <div data-role="header" data-position="fixed" data-top-toggle="false">
	<h1>スタッフデータ<span id="editoradd"><span></h1>
	<a href="#" data-role="button" data-theme="b" data-icon="check" class="ui-btn-right form_submit" data-ajax="false"><span id="editoraddbtn"></span></a>
      </div>
      
      <div class="ui-content" role="main">

	<form id="admin_staffadd_form">
	  <input type="hidden" name="id" id="id" />
	  <input type="hidden" name="date" id="date" />

          <div class="ui-field-contain">
            <label for="kind">種別</label>
            <fieldset data-role="controlgroup" data-type="horizontal">
              <label><input type="radio" name="kind" value="trainer">トレーナー</label>
              <label><input type="radio" name="kind" value="doctor">ドクター</label>
            </fieldset>
          </div>

	  <div class="ui-field-contain">
	    <label for="uid">スタッフID</label>
	    <input type="text" id="uid" name="uid" placeholder="スタッフID">
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
            <label for="password">パスワード</label>
	    <input type="password" name="password" placeholder="パスワード">
	  </div>
	  

	</form>
	
      </div>

      <div data-role="footer" data-position="fixed" data-tap-toggle="false">
	<div class="ui-bar">
	  <a href="staffs.php" data-role="button" data-theme="b" data-icon="back" data-transition="slide" data-direction="reverse">スタッフ管理に戻る</a>
	</div>
      </div>

    </div>

  </body>

</html>

  
    
	       
