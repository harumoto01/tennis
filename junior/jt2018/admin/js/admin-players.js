var responsecache;
var reload = true;
var uids = [];

// players.php
$(document).on('pagebeforeshow','#admin_players',function(){
    console.log('pagebeforeshow: admin_players');

    if (reload) {
	var list = $('#admin_players_list');
	list.empty();
	$.mobile.loading('show');
	$.ajax({
	    url: 'ajax/get_players.php',
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
		    
$(document).on('pagecreate','#admin_playeradd',function(){
    console.log('pagecreate: admin_playeradd');

    var validator = $('#admin_playeradd_form').validate({
    	rules: {
	    uid: {
		required: true
//		uniqueuid: true
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
	    birth_year: {
		required: true
	    },
	    birth_month: {
		required: true
	    },
	    birth_day: {
		required: true
	    },
    	    // school: {
    	    // 	required: true
    	    // },
	    pref: {
		required: true
	    },
	    category: {
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
	    uid: {
		required: '選手IDを入力してください。',
		uniqueuid: 'この選手IDは使用されています。'
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
	    birth_year: {
		required: '生年月日を入力してください。',
	    },
	    birth_month: {
	    	required: '生年月日を入力してください。',
	    },
	    birth_day: {
	    	required: '生年月日を入力してください。',
	    },
	    // birthdate: {
	    // 	required: '生年月日を入力してください。'
	    // },
    	    // school: {
    	    // 	required: '学校名を入力してください。'
    	    // },
	    pref: {
		required: '都道府県を選択してください。'
	    },
	    category: {
		required: 'カテゴリーを選択してください。'
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

$(document).on('pagebeforeshow','#admin_playeradd',function(){
    console.log('pagebeforeshow: admin_playeradd');

    //refresh
    $('input[name="gender"]').checkboxradio('refresh');
    $('select[name="pref"]').selectmenu('refresh');
    $('select[name="birth_year"]').selectmenu('refresh');
    $('select[name="birth_month"]').selectmenu('refresh');
    $('select[name="birth_day"]').selectmenu('refresh');
    $('input[name="category"]').checkboxradio('refresh');
    $('input[name="password_changed"]').flipswitch('refresh');
});

$(document).on('click', 'a.form_submit', function() {
    $('a.form_submit').attr('disabled', true);
    if (!$('#admin_playeradd_form').valid()) {
	console.log('invalid');
	var firstError = $(this).find(":input.error:first");
	$('#admin_playeradd_submit').attr('disabled', false);
	firstError.focus();
	return false;
    }
	   
    $.mobile.loading('show');
    $.ajax({
	url: 'ajax/upsert_player.php',
	type: 'POST',
	dataType: 'json',
	data: $('#admin_playeradd_form').serialize(),
	timeout: 3000
    })
	.done(function(response){
	    console.log(response);
	    reload = true;
	    $.mobile.loading('hide');
	    $('body').pagecontainer('change', '#admin_players', { transition: 'slide', reverse: true });
	})
	.fail(function(jqxhr,status,error){
	    console.log(error);
	    $.mobile.loading('hide');
	    return false;
	});
    return false;
});

		    
function write_data(response) {
    var list = $('#admin_players_list');
    uids = [];
    if (response.status != "OK") {
	list.append('<div class="message">選手情報の取得に失敗しました。</div>');
    } else if (response.data.length == 0) {
	list.append('<div class="message">条件に合う選手がいません。</div>');
    } else {
	var hText = "";
	hText +=
	    '<table id="admin_players_table" data-role="table" data-mode="none" class="ui-responsive" data-filter="true" data-input="#key">'+
	    '<thead>'+
	    '<tr>'+
	    '<th class="players_uid">選手ID</th>'+
	    '<th class="players_name">氏名</th>'+
	    '<th class="players_name_kana">ふりがな</th>'+
	    '<th class="players_gender">性別</th>'+
	    '<th class="players_affil">所属</th>'+
	    '<th class="players_pref">都道府県</th>'+
	    '<th class="players_category">カテゴリー</th>'+
	    '</tr>'+
	    '</thead>'+
	    '<tbody id="admin_players_tbody">'+
	    '</tbody>'+
	    '</table>';
	list.append(hText);
	var e = $('#admin_players_tbody');
	
	$.each(response.data, function(docid, pd){
	    uids.push(pd.uid);
	    hText =
		'<tr data-filtertext="'+h(pd.name_kana+pd.name)+'" class="player" docid="'+docid+'">'+
		'<td class="players_uid">'+pd.uid+'</td>'+
		'<td class="players_name">'+h(pd.name)+'</td>'+
		'<td class="players_name_kana">'+h(pd.name_kana)+'</td>'+
		'<td class="players_gender">'+genders[pd.gender]+'</td>'+
		'<td class="players_affil">'+h(pd.club)+'</td>'+
		'<td class="players_pref">'+prefs[pd.pref]+'</td>'+
		'<td class="players_category">'+categories[pd.category]+'</td>'+
		'</tr>';
	    e.append(hText);
	});
    }
    list.enhanceWithin();
}

$(document).on('click', 'tr.player', function() {
    var docid = $(this).attr('docid');
    go(docid);
});

function go(docid) {
    console.log(docid);
    var pd = responsecache.data[docid];
    $('input[name="id"]').val(docid);
    $('input[name="date"]').val(pd.date);
    $('input[name="uid"]').val(pd.uid);
    $('input[name="name"]').val(pd.name);
    $('input[name="name_kana"]').val(pd.name_kana);
    $('input[name="gender"]').val([pd.gender]);
    var bd = new Date(pd.birthdate);
    $('select[name="birth_year"]').val(bd.getFullYear());
    $('select[name="birth_month"]').val(bd.getMonth()+1);
    $('select[name="birth_day"]').val(bd.getDate());
    $('input[name="club"]').val(pd.club);
    $('select[name="pref"]').val(pd.pref);
    $('input[name="category"]').val([pd.category]);
    $('input[name="password"]').val('');
    $('input[name="password_changed"]').val(pd.password_changed ? [] : [0]);
    $('input[name="email"]').val(pd.email ? pd.email : '');
    
    $('#editoradd').text('編集');
    $('#editoraddbtn').text('更新');
    $('#admin_playeradd_form').valid();
    $('body').pagecontainer('change', '#admin_playeradd', { transition: 'slide' });
}
    
$(document).on('click', 'a.playeradd', function() {
    $('input[name="id"]').val('');
    $('input[name="date"]').val('');
    $('input[name="uid"]').val('');
    $('input[name="name"]').val('');
    $('input[name="name_kana"]').val('');
    $('input[name="gender"]').val([]);
    $('select[name="birth_year"]').val('');
    $('select[name="birth_month"]').val('');
    $('select[name="birth_day"]').val('');
    $('input[name="club"]').val('');
    $('select[name="pref"]').val('');
    $('input[name="category"]').val([]);
    $('input[name="password"]').val('');
    $('input[name="password_changed"]').val([0]);
    $('input[name="email"]').val('');

    $('#editoradd').text('追加');
    $('#editoraddbtn').text('登録');
    $('body').pagecontainer('change', '#admin_playeradd', { transition: 'slide' });
});    
