<?php
session_start();
if (!isset($_SESSION["csrf_token"])) {
    $_SESSION["csrf_token"] = base64_encode(openssl_random_pseudo_bytes(32));
}
?>
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1"> 
<link rel="stylesheet" href="/css/jquery.mobile-1.4.5.min.css" />
<script src="/js/jquery-2.1.4.min.js"></script>
<script src="/js/jquery.mobile-1.4.5.min.js"></script>
    <script>
    $(document).on('pagecreate', function(){
	console.log('pagecreate');
	window.csrf = { csrf_token: '<?= $_SESSION["csrf_token"] ?>' };
	$.ajaxSetup({data: window.csrf});
	$('#btnsend').on('click', function(){
	    $.mobile.loading('show');
	    $.ajax({
		url: './ajax.php',
		type: 'POST',
		dataType: 'json',
		data: { 'uid' : $('#uid').val() },
		timeout: 5000
	    })
		.done(function(data) {
		    $.mobile.loading('hide');
		    console.log(data);
		    $('.result').html(data.name);
		})
		.fail(function() {
		});
	})
    });
</script>
</head>
<body>
  <form method="post" return false>
    <input type="text" name="uid" id="uid"/>

  </form>
    <button id="btnsend">hoge</button>
  <div class="result">
  </div>

</body>
</html>
  
