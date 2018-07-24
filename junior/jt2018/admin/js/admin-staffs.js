var responsecache;
var reload = true;
var uids = [];

// staffs.php
$(document).on('pagebeforeshow','#admin_staffs',function(){
    console.log('pagebeforeshow: admin_staffs');

    if (reload) {
	var list = $('#admin_staffs_list');
	list.empty();
	$.mobile.loading('show');
	$.ajax({
	    url: 'ajax/get_staffs.php',
	    type: 'POST',
	    dataType: 'json',
	    timeout: 3000
	})
	    .done(function(response) {
		console.log(response);
		responsecache = response;
		write_data(responsecache);
		reload = false;
		$.mobile.loading('hide');
	    })
	    .fail(function(response) {
		console.log(response);
		$.mobile.loading('hide');
		location.href = 'menu.php';
	    });
    }
});
		    
$(document).on('pagecreate','#admin_staffadd',function(){
    console.log('pagecreate: admin_staffadd');

    var validator = $('#admin_staffadd_form').validate({
    	rules: {
	    kind: {
		required: true
	    },
	    uid: {
		required: true,
		uniqueuid: {
		    depends: function() {
			return ($('#id').val() == '');
		    }
		}
	    },
	    name: {
		required: true
	    },
	    name_kana: {
		required: true
	    },
    	    gender: {
    		required: true
    	    },
	    password: {
		required: {
		    depends: function() {
			return ($('#id').val() == '');
		    }
		}
	    }
    	},
	groups: {
	    birth_ymd: "birth_year birth_month birth_day",
	},
    	messages: {
	    kind: {
		required: 'スタッフ種別を選択してください。'
	    },
	    uid: {
		required: 'スタッフIDを入力してください。',
		uniqueuid: 'このIDは使用されています。'
	    },
	    name: {
		required: '氏名を入力してください。'
	    },
	    name_kana: {
		required: 'ふりがなを入力してください。'
	    },
    	    gender: {
    		required: '性別を選択してください。'
    	    },
	    password: {
		required: 'パスワードを入力してください。'
	    }
    	},
	errorPlacement: function(error, element) {
	    if (element.attr('name') == 'birth_year' ||
		element.attr('name') == 'birth_month' ||
		element.attr('name') == 'birth_day' ||
		element.attr('type') == 'radio') {
		error.insertAfter(element.parents('fieldset'));
	    } else {
		error.insertAfter(element.parent());
	    }
	}
    });
    $.validator.addMethod("uniqueuid", function(value, element) {
	return this.optional(element) || !uids.includes(value);
    });
});

$(document).on('pagebeforeshow','#admin_staffadd',function(){
    console.log('pagebeforeshow: admin_staffadd');

    //refresh
    $('input[name="kind"]').checkboxradio('refresh');
    $('input[name="gender"]').checkboxradio('refresh');
});

$(document).on('click', 'a.form_submit', function() {
    $('a.form_submit').attr('disabled', true);
    if (!$('#admin_staffadd_form').valid()) {
	console.log('invalid');
	var firstError = $(this).find(":input.error:first");
	$('#admin_staffadd_submit').attr('disabled', false);
	firstError.focus();
	return false;
    }
    $.mobile.loading('show');
    $.ajax({
	url: 'ajax/upsert_staffs.php',
	type: 'POST',
	dataType: 'json',
	data: $('#admin_staffadd_form').serialize(),
	timeout: 3000
    })
	.done(function(response){
	    console.log(response);
	    reload = true;
	    $.mobile.loading('hide');
	    $('body').pagecontainer('change', '#admin_staffs', { transition: 'slide', reverse: true });
	})
	.fail(function(jqxhr,status,error){
	    console.log(error);
	    $.mobile.loading('hide');
	    return false;
	});
    return false;
});

		    
function write_data(response) {
    var list = $('#admin_staffs_list');
    uids = [];
    if (response.status != "OK") {
	list.append('<div class="message">スタッフ情報の取得に失敗しました。</div>');
    } else if (response.data.length == 0) {
	list.append('<div class="message">条件に合うスタッフがいません。</div>');
    } else {
	var hText = "";
	hText +=
	    '<table id="admin_staffs_table" data-role="table" data-mode="none" class="ui-responsive" data-filter="true" data-input="#key">'+
	    '<thead>'+
	    '<tr>'+
	    '<th class="staffs_uid">スタッフID</th>'+
	    '<th class="staffs_name">氏名</th>'+
	    '<th class="staffs_name_kana">ふりがな</th>'+
	    '<th class="staffs_gender">性別</th>'+
	    '<th class="staffs_kind">種別</th>'+
	    '</tr>'+
	    '</thead>'+
	    '<tbody id="admin_staffs_tbody">'+
	    '</tbody>'+
	    '</table>';
	list.append(hText);
	var e = $('#admin_staffs_tbody');
	
	$.each(response.data, function(docid, pd){
	    uids.push(pd.uid);
	    hText =
		'<tr data-filtertext="'+h(pd.name_kana)+'" class="staff" docid="'+docid+'">'+
		'<td class="staffs_uid">'+pd.uid+'</td>'+
		'<td class="staffs_name">'+h(pd.name)+'</td>'+
		'<td class="staffs_name_kana">'+h(pd.name_kana)+'</td>'+
		'<td class="staffs_gender">'+genders[pd.gender]+'</td>'+
		'<td class="staffs_kind">'+kinds[pd.kind]+'</td>';
	    hText += '</tr>';
	    e.append(hText);
	});
    }
    list.enhanceWithin();

    $('.staff').on('click', function() {
	var docid = $(this).attr('docid');
	go(docid);
    });
}

function go(docid) {
    console.log(docid);
    var pd = responsecache.data[docid];
    $('input[name="id"]').val(docid);
    $('input[name="date"]').val(pd.date);
    $('input[name="kind"]').val([pd.kind]);
    $('input[name="uid"]').val(pd.uid);
    $('input[name="name"]').val(pd.name);
    $('input[name="name_kana"]').val(pd.name_kana);
    $('input[name="gender"]').val([pd.gender]);
    $('input[name="password"]').val('');
    
    $('#editoradd').text('編集');
    $('#editoraddbtn').text('更新');
    $('#admin_staffadd_form').valid();
    $('body').pagecontainer('change', '#admin_staffadd', { transition: 'slide' });
}
    
$(document).on('click', 'a.staffadd', function() {
    $('input[name="id"]').val('');
    $('input[name="date"]').val('');
    $('input[name="kind"]').val([]);
    $('input[name="uid"]').val('');
    $('input[name="name"]').val('');
    $('input[name="name_kana"]').val('');
    $('input[name="gender"]').val([]);
    $('input[name="password"]').val('');

    $('#editoradd').text('追加');
    $('#editoraddbtn').text('登録');
    $('body').pagecontainer('change', '#admin_staffadd', { transition: 'slide' });
});    
