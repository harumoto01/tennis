<?php

session_start();

if (isset($_SESSION["message"])) {
    $message = $_SESSION["message"];
    unset($_SESSION["message"]);
}

$_SESSION = [];
$_SESSION["SID"] = session_id();
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>関西ジュニアテニス選手権大会</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="css/jquery.mobile-1.4.5.min.css" />
    <script src="js/jquery-2.1.4.min.js"></script>
    <script src="js/jquery.mobile-1.4.5.min.js"></script>
    <script src="js/common.js"></script>
    <script src="js/login.js"></script>
    <link rel="stylesheet" href="css/common.css" />
  </head>
  
  <body>

    <div id="index_p1" data-role="page">

      <div data-role="header" data-position="fixed" data-top-toggle="false">
	<h1>関西ジュニアテニス選手権大会　ログイン</h1>
      </div>

      <div class="ui-content" role="main">
	<form id="login_form">
	<div class="ui-field-contain">
	  <label for="username">ユーザID:</label>
	  <input type="text" name="username" id="username" value="" autocorrect="off" autocapitalize="off" autocomplete="off" placeholder="ユーザIDを入力"/>
	</div>
	<div class="ui-field-contain">
	  <label for="password">パスワード:</label>
	  <input type="password" name="password" id="password" autocomplete="off" value="" placeholder="パスワードを入力"/>
	</div>

        <div class="message" id="message">
    <?= isset($message) ? htmlspecialchars($message) : "" ?>
	</div>

	<button id="login" type="submit" data-role="submit">ログイン</button><br><br>
	</form>
      </div>

    </div>
    
  </body>
</html>
