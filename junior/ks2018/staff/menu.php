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
    <title>トップページ</title>
    <meta name="viewport" content="width=device-width, initial-scale=1"> 
    <link rel="stylesheet" href="../css/jquery.mobile-1.4.5.min.css" />
    <script src="../js/jquery-2.1.4.min.js"></script>
    <script src="../js/jquery.mobile-1.4.5.min.js"></script>
    <script src="../js/jquery.validate.js"></script>
  </head>

  <body>

    <div id="staff_menu" data-role="page">

      <div data-role="header" data-position="fixed" data-tap-toggle="false">
	<h1>メニュー</h1>
	<a href="../logout.php" class="ui-btn ui-btn-b ui-btn-right ui-corner-all" data-ajax="false">ログアウト</a>
      </div>

      <div class="ui-content" role="main">

	<a href="plist.php" data-role="button" data-ajax="false">選手一覧</a>
	<a href="treatment.php" data-role="button" data-ajax="false">処置・診療記録一覧</a>
	<br/><br/>
	<a href="stats_s1.php" data-role="button" data-ajax="false">【集計】大会前シート</a>
	<a href="stats_s2.php" data-role="button" data-ajax="false">【集計】試合当日シート</a>
	<a href="stats_treatment.php" data-role="button" data-ajax="false">【集計】処置・診療</a>

      </div>

      <div data-role="footer" data-position="fixed" data-tap-toggle="false">
	<div class="ui-bar" align="right">
	  <span>　</span>
	</div>
      </div>

    </div>
    
  </body>

</html>

  
    
	       
