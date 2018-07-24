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
    <title>トップページ</title>
    <meta name="viewport" content="width=device-width, initial-scale=1"> 
    <link rel="stylesheet" href="../css/jquery.mobile-1.4.5.min.css" />
    <script src="../js/jquery-2.1.4.min.js"></script>
    <script src="../js/jquery.mobile-1.4.5.min.js"></script>
    <script src="../js/common.js"></script>
    <link rel="stylesheet" href="css/admin-common.css" />
  </head>

  <body>

    <div id="admin_menu" data-role="page">

      <div data-role="header" data-position="fixed" data-top-toggle="false">
	<h1>メニュー</h1>
	<a href="../logout.php" class="ui-btn ui-btn-b ui-btn-right ui-corner-all" data-ajax="false">ログアウト</a>
      </div>
    
      <div class="ui-content" role="main">

<?php
if (isset($message)) {
?>
        <div class="message"><?= h($message) ?></div>
<?php
}
?>

        <a href="players.php" data-role="button" data-ajax="false">選手管理</a>
	<a href="staffs.php" data-role="button" data-ajax="false">スタッフ管理</a>
<!--	<a href="import_players.php" data-role="button" data-ajax="false">選手データインポート（作業中）</a> -->
<br/><br/>
	<a href="stats2.php" data-role="button" data-ajax="false">セルフチェックシート登録状況</a>

      </div>
      
      <!-- <div data-role="footer" data-position="fixed" data-tap-toggle="false" align="center"> -->
      <!-- 	<div class="ui-bar"> -->

      <!-- 	</div> -->
      <!-- </div> -->
    </div>

  </body>

</html>

  
    
	       
