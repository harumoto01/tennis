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

if (!isset($_POST["player_uid"]) && !isset($_SESSION["player_uid"])) {
   $player_uid = "*";
   $_SESSION["player_uid"] = "*";//header("Location: plist.php");
} else if (isset($_POST["player_uid"])) {
    $player_uid = $_POST["player_uid"];
    $_SESSION["player_uid"] = $player_uid;
} else {
    $player_uid = $_SESSION["player_uid"];
}

if (isset($_SESSION["message"])) {
    $message = $_SESSION["message"];
    unset($_SESSION["message"]);
} else if (isset($message)) {
    unset($message);
}
$uid = $_SESSION["uid"];
$is_trainer = isset($_SESSION["is_trainer"]) ? $_SESSION["is_trainer"] : false;
$is_doctor = isset($_SESSION["is_doctor"]) ? $_SESSION["is_doctor"] : false;
?>
<!DOCTYPE html> 
<html>
  <head>
    <meta charset="utf-8">
    <title>処置・診療記録</title>
    <meta name="viewport" content="width=device-width, initial-scale=1"> 
    <link rel="stylesheet" href="../css/jquery.mobile-1.4.5.min.css" />
    <script src="../js/jquery-2.1.4.min.js"></script>
    <script src="../js/jquery.mobile-1.4.5.min.js"></script>
    <script src="../js/jquery.validate.js"></script>
    <script src="../js/fabric.min.js"></script>
    <script src="../js/common.js"></script>
    <script src="js/staff-treatment.js"></script>
    <link rel="stylesheet" href="css/staff-treatment.css" />
  </head>

  <body>
    <div id="staff_treatment_list" data-role="page">
      <div data-role="header" data-position="fixed" data-tap-toggle="false">
	<h1>処置・診療記録</h1>
	<a href="../logout.php" class="ui-btn ui-btn-b ui-btn-right ui-corner-all" data-ajax="false">ログアウト</a>
      </div>
      
      <div class="ui-content" role="main">
	<input type="hidden" id="uid" value="<?= $uid ?>" />
	<input type="hidden" id="player_uid" value="<?= $player_uid ?>" />
	<input type="hidden" id="is_trainer" value="<?= $is_trainer ? 1 : 0 ?>" />
	<input type="hidden" id="is_doctor" value="<?= $is_doctor ? 1 : 0 ?>" />
	<div id="staff_treatment_list_list"></div>
      </div>

      <div data-role="footer" data-position="fixed" data-tap-toggle="false">
	<div class="ui-bar">
<?php
    if ($player_uid != "*") {
?>
	  <a href="plist.php" data-role="button" data-theme="b" data-icon="back" data-ajax="false">選手一覧に戻る</a>
	  <a data-role="button" data-theme="b" data-icon="plus" id="addpage" class="menu_addpage" style="float:right"><?= $is_trainer ? "処置記録を追加" : "診療記録を追加" ?></a>
<?php
    } else {
?>
	  <a href="menu.php" data-role="button" data-theme="b" data-icon="back" data-ajax="false">トップページに戻る</a>
<?php
    }
?>
	</div>
      </div>
      
    </div>
  </body>
  
</html>
