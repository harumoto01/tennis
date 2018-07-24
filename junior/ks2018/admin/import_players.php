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

?>
<!DOCTYPE html> 
<html>
  <head>
    <meta charset="utf-8">
    <title>選手データインポート</title>
    <meta name="viewport" content="width=device-width, initial-scale=1"> 
    <link rel="stylesheet" href="../css/jquery.mobile-1.4.5.min.css" />
    <script src="../js/jquery-2.1.4.min.js"></script>
    <script src="../js/jquery.mobile-1.4.5.min.js"></script>
    <script src="../js/jquery.validate.js"></script>
    <script src="../js/common.js"></script>
    <script src="js/admin-import.js"></script>
    <link rel="stylesheet" href="css/admin-players.css" />
  </head>

  <body>

    <div id="admin_import" data-role="page">

      <div data-role="header" data-position="fixed" data-top-toggle="false">
	<h1>選手データインポート</h1>
	<a href="../logout.php" class="ui-btn ui-btn-b ui-btn-right ui-corner-all" data-ajax="false">ログアウト</a>
      </div>
      
      <div class="ui-content" role="main">
	<div id="message"></div>
	
	<form method="POST" id="import_form">
	  <input type="file" name="csvfile" id="csvfile">
	  <button type="button" id="sendfile">送信</button>
	</form>

	<div id="import_data_list">
	</div>
	
      </div>

      <div data-role="footer" data-position="fixed" data-tap-toggle="false">
	<div class="ui-bar">
	  <a href="menu.php" data-role="button" data-theme="b" data-icon="back" data-ajax="false">トップページに戻る</a>
	</div>
      </div>
    </div>

  </body>

</html>

  
    
	       
