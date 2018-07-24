<?php
   require "../inc/conf.php";
   
session_start();

if (isset($_SESSION["message"])) {
    $message = $_SESSION["message"];
    unset($_SESSION["message"]);
}
$_SESSION["SID"] = session_id();
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>関西ジュニアテニス大会</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="../css/jquery.mobile-1.4.5.min.css" />
    <script src="../js/jquery-2.1.4.min.js"></script>
    <script src="../js/jquery.mobile-1.4.5.min.js"></script>
    <script src="../js/jquery.validate.js"></script>
    <script src="../js/common.js"></script>
    <script src="js/firstlogin.js"></script>
    <link rel="stylesheet" href="css/player-common.css" />
  </head>
  
  <body>

    <div id="firstlogin_p1" data-role="page">

      <div data-role="header" data-position="fixed" data-top-toggle="false">
	<h1>初回ログイン</h1>
      </div>

      <div class="ui-content" role="main">
	<h2><?= h($_SESSION["name"]) ?> 様</h2>
	<div class="ui-bar ui-bar-a ui-corner-all">初めてのログインですので、パスワード変更と連絡用メールアドレスの登録をお願いします。</div>
	<form id="firstlogin_form" method="POST" data-ajax="false">
	  <div class="ui-field-contain">
	    <label for="password1">新パスワード:</label>
	    <input type="password" name="password1" id="password1" autocomplete="off" value="" placeholder="パスワードを入力"/>
	  </div>
	  <div class="ui-field-contain">
	    <label for="password2">新パスワード（確認）:</label>
	    <input type="password" name="password2" id="password2" autocomplete="off" value="" placeholder="パスワードを入力"/>
	  </div>
	  <div class="ui-field-contain">
	    <label for="email">メールアドレス:</label>
	    <input type="text" name="email" id="email" value="" autocorrect="off" autocapitalize="off" autocomplete="off" placeholder="メールアドレスを入力"/>
	  </div>

	  <button id="firstlogin_submit" type="submit" data-role="submit" data-theme="b">この内容で登録する</button><br><br>

        <div class="message" id="message">
    <?= isset($message) ? htmlspecialchars($message) : "" ?>
	</div>
	  
	</form>
      </div>

    </div>
    
  </body>
</html>
