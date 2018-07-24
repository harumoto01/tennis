// firstlogin page
$(document).on('pagecreate','#firstlogin_p1',function(){
    console.log("pagecreate: firstlogin_p1");

    const validator = $('#firstlogin_form').validate({
	rules: {
	    password1: {
		required: true,
		minlength: 8
	    },
	    password2: {
		equalTo: '#password1'
	    },
	    email: {
		required: true,
		email: true
	    }
	},
	messages: {
	    password1: {
		required: '設定するパスワードを入力してください。（８文字以上）',
		minlength: 'パスワードは８文字以上入力してください。'
	    },
	    password2: {
		equalTo: '上と同じパスワードを入力してください。'
	    },
	    email: {
		required: 'メールアドレスを入力してください。',
		email: 'メールアドレスを正しく入力してください。'
	    }
	},
	errorPlacement: function(error, element) {
	    error.insertAfter(element.parent());
	}
    });



});


$(document).on('submit', '#firstlogin_form', function() {
    $('#firstlogin_submit').attr('disabled', true);
    if (!$(this).valid()) {
	console.log('invalid');
    	$('#firstlogin_submit').attr('disabled', false);
	return false;
    }
    console.log('valid');
    
    $.mobile.loading('show');
    $.ajax({
	url: 'ajax/update_pw.php',
	type: 'POST',
	dataType: 'json',
	data: $(this).serialize(),
	timeout: 10000
    })
	.done(function(response) {
	    $.mobile.loading('hide');
	    console.log(response);
	    if (response.status == 'OK') {
		location.href='menu.php';
	    } else {
		$('#message').html(response.message);
    		$('#firstlogin_submit').attr('disabled', false);
	    }
	})
	.fail(function(){
	    $.mobile.loading('hide');
	    console.log("fail");
	    $('#message').html('システムエラー発生');
	});
    return false;
});

