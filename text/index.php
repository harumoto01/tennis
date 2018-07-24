
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1"> 
    <link rel="stylesheet" href="/css/jquery.mobile-1.4.5.min.css" />
    <script src="/js/jquery-2.1.4.min.js"></script>
    <script src="/js/jquery.mobile-1.4.5.min.js"></script>
    <script src="/js/jquery.validate.js"></script>
    <script src="/js/exif.js"></script>
  </head>

  <body>

    <div id="sheet1_p1" data-role="page">
      <div class="ui-content" data-role="main">

	<div class="ui-block-a">
	  <input type="file" class="ui-btn ui-corner-all" accept="image/*" capture="true" id="camera">
	</div>
	<div>
	  <img id="thumb" src="" width="300">
	</div>
	<canvas id="c" width="640" height="480"></canvas>
	
    <script>
    $('#camera').on('change',function(){
	if (this.files.length > 0) {
	    var file = this.files[0];
	    var reader = new FileReader();
	    reader.readAsDataURL(file);
	    reader.onload = function(){
		$('#thumb').attr('src', reader.result);
	    };
	}
    });
	</script>
	

      </div>
    </div>

  </body>
</html>
