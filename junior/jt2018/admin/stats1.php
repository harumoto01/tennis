<?php
require "../inc/conf.php";

session_start();

if (!isset($_SESSION["uid"])) {
    $_SESSION["message"] = "タイムアウトのためログアウトしました。";
    header("Location: ../index.php");
    exit(0);
}
if (!isset($_SESSION["is_admin"]) || !$_SESSION["is_admin"]) {
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
    <title>集計データ</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="refresh" content="300">
    <link rel="stylesheet" href="../css/jquery.mobile-1.4.5.min.css" />
    <script src="../js/jquery-2.1.4.min.js"></script>
    <script src="../js/jquery.mobile-1.4.5.min.js"></script>
    <script src="../js/jquery.validate.js"></script>
    <script src="../js/Chart.bundle.min.js"></script>
    <script src="../js/common.js"></script>
    <script src="js/admin-stats1.js"></script>
  </head>

  <body>

    <div id="admin_stats1" data-role="page">

      <div data-role="header" data-position="fixed" data-tap-toggle="false">
	<h1>集計データ</h1>
	<a href="../logout.php" class="ui-btn ui-btn-b ui-btn-right ui-corner-all" data-ajax="false">ログアウト</a>
      </div>

      <div class="ui-content" role="main">

        <div class="ui-bar ui-bar-a ui-corner-all">大会前セルフチェックシート登録状況</div>

	<canvas id="myChart"></canvas>

      </div>

      <div data-role="footer" data-position="fixed" data-tap-toggle="false">
	<div class="ui-bar">
	  <a href="menu.php" data-role="button" data-theme="b" data-icon="back" data-ajax="false">トップページに戻る</a>
	</div>
      
    </div>
  </body>
</html>

  
