<?php
require "../inc/conf.php";

session_start();

if (!isset($_SESSION["uid"])) {
    $_SESSION["message"] = "タイムアウトのためログアウトしました。";
    header("Location: ../index.php");
    exit(0);
}
$uid = $_SESSION["uid"];
$name = $_SESSION["name"];

if (isset($_SESSION["message"])) {
    $message = $_SESSION["message"];
    unset($_SESSION["message"]);
} else if (isset($message)) {
    unset($message);
}
if (isset($_SESSION["id"])) {
    unset($_SESSION["id"]);
}

if (isset($_SESSION["docid"])) {
    unset($_SESSION["docid"]);
}

?>
<!DOCTYPE html> 
<html>
  <head>
    <meta charset="utf-8">
    <title>トップメニュー</title>
    <meta name="viewport" content="width=device-width, initial-scale=1"> 
    <link rel="stylesheet" href="../css/jquery.mobile-1.4.5.min.css" />
    <script src="../js/jquery-2.1.4.min.js"></script>
    <script src="../js/jquery.mobile-1.4.5.min.js"></script>
    <script src="../js/common.js"></script>
    <script src="js/player-common.js"></script>
    <link rel="stylesheet" href="css/player-common.css" />

  </head>

  <body>

    <div id="menu_p1" data-role="page">
      <input type="hidden" id="uid" value="<?= $uid ?>" />

      <div data-role="header" data-position="fixed" data-tap-toggle="false" class="ui-nodisc-icon">
	<h1>トップメニュー</h1>
	<a href="../logout.php" class="ui-btn ui-btn-b ui-btn-right ui-corner-all" data-ajax="false">ログアウト</a>
      </div>
    
      <div class="ui-content" role="main">

<?php
if (isset($message)) {
?>
        <div class="message"><?= $message ?></div>
<?php
}

echo '<div class="ui-bar ui-bar-a ui-corner-all">大会前　セルフチェック' . "\n";
echo '<div id="menu_div1"></div>' . "\n";
echo "</div>\n";
echo "<br/>\n";

echo '<div class="ui-bar ui-bar-a ui-corner-all">試合当日　セルフチェック' . "\n";
echo '<div id="menu_div2"></div>' . "\n";
echo "</div>\n";
?>

      </div>

      <div data-role="footer" data-position="fixed" data-tap-toggle="false">
	<div class="ui-bar" align="right">
	  <span><?= htmlspecialchars($name) ?>　様</span>

	</div>
      </div>
      
    </div>

  </body>

</html>
