// index (login) page
$(document).on('pageinit','#index_p1',function(){
    console.log("pageinit:index_p1");
    $('#login').on('click',function(){
	$.mobile.loading('show');
	$.ajax({
	    url: 'ajax/chkpw.php',
	    type: 'POST',
	    dataType: 'json',
	    data: { 'username': $('#username').val(), 'password': $('#password').val() },
	    timeout: 5000
	})
	    .done(function(response) {
		$.mobile.loading('hide');
		console.log(response);
		if (response.status == 'OK') {
		    switch (response.role) {
		    case 'player':
			if (response.bypass || response.data.password_changed) {
			    location.href='player/menu.php';
			    return true;
			} else {
			    location.href='player/firstlogin.php';
			    return true;
			}
		    case 'staff':
			location.href='staff/menu.php';
			return true;
		    case 'admin':
			location.href='admin/menu.php';
			return true;
		    }
		} else {
		    $('#message').html(response.message);
		}
	    })
	    .fail(function(){
		$.mobile.loading('hide');
		console.log("fail");
		$('#message').html('システムエラー発生');
	    });
	return false;
    });
    
});

