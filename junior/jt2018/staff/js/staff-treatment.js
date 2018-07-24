var detach0 = []
var detach1 = [];
var ckind = [];
var canvas = [];
var editable;
var browseonly;
var players;
var staffs;
var player_name;
var staff_name;

// treatment_list page ---------------------------------------------------------------------------

$(document).on('pagebeforeshow', '#staff_treatment_list', function() {
    console.log('pagebeforeshow: staff_treatment_list');
    $('.treatment_page').remove();
    $('.drawfig_page').remove();
    $.mobile.loading('show');

    $.ajax({
	url: 'ajax/get_staffs.php',
	type: 'POST',
	dataType: 'json',
	timeout: 10000
    })
	.done(function(response) {
	    staffs = response.data;
	    console.log(staffs);
	    const player_uid = $('#player_uid').val();
	    if (player_uid != '*') {
		browseonly = false;
		$.ajax({
		    url: 'ajax/get_alldata_by_uid.php',
		    type: 'POST',
		    dataType: 'json',
		    data: { index: es_players+','+es_trainer_record+','+es_doctor_record,
			    filter: { uid: player_uid } },
		    timeout: 10000
		})
		    .done(function(response){
			console.log(response);
			players = response.data[es_players];
			write_data(response, player_uid);
		    })
		    .fail(function(response){
			console.log(response);
			return false;
		    });
	    } else {
		browseonly = true;
		$.ajax({
		    url: 'ajax/get_alldata_by_uid.php',
		    type: 'POST',
		    dataType: 'json',
		    data: { index: es_players+','+es_trainer_record+','+es_doctor_record,
			    filter: {} },
		    timeout: 10000
		})
		    .done(function(response){
			console.log(response);
			players = response.data[es_players];
			write_data(response, player_uid);
		    })
		    .fail(function(response){
			console.log(response);
			return false;
		    });
	    }
	});

});


function write_data(response, player_uid) {
    const list = $('#staff_treatment_list_list');
    const is_trainer = ($('#is_trainer').val() == '1');
    let playerdata;
    list.empty();
    if (response.status != 'OK') {
	list.append('<div class="message">選手情報の取得に失敗しました。</div>');
	return false;
    }

    if (player_uid != '*') {
	for (u in response.data[es_players]) {
	    playerdata = response.data[es_players][u];
	}

	let hText =
            '<div class="ui-bar ui-bar-a ui-corner-all">'+
	    h(playerdata.name)+'（'+h(playerdata.name_kana)+'）, '+genders[playerdata.gender]+', '+categories[playerdata.category]+', '+h(playerdata.club)+', '+prefs[playerdata.pref]+
	    '</div><br/>';
	list.append(hText);
    }
    
    if (response.data['treatment'] == null) {
	list.append('<div class="message">処置・診療記録はありません。</div>');
    } else {
	let hText =
	    '<table id="staff_treatment_table" data-role="table" data-mode="none" class="ui-responsive" data-filter="false">'+
	    '<thead>'+
	    '<tr>'+
	    '<th class="rlist_no">#</th>'+
	    '<th class="rlist_date">日時</th>';
	if (player_uid == '*') {
	    hText += '<th class="rlist_name">選手</th>';
	}
	hText +=
	    '<th class="rlist_name">処置・診療者</th>'+
	    '<th class="rlist_kind">種別</th>'+
	    '<th class="rlist_part">部位</th>'+
	    '<th class="rlist_diag">種類</th>'+
	    '<th class="rlist_treat">処置</th>'+
	    '</thead>'+
	    '<tbody id="staff_treatment_tbody">'+
	    '</tbody>'+
	    '</table>';
	list.append(hText);
	list.enhanceWithin();

	const e = $('#staff_treatment_tbody');
	let treatment_no = response.data['treatment'].length;
	$.each(response.data['treatment'], function(c, v) {
	    $.each(v, function(docid, v1) {
		$.each(v1, function(i, v2) {
		    if (i == es_trainer_record || i == es_doctor_record) {
			let trclass;
			let tkind;
			if (i == es_trainer_record) {
			    trclass = 'treatment_trainer';
			    tkind = 'trainer';
			} else {
			    trclass = 'treatment_doctor';
			    tkind = 'doctor';
			}
			const regdate = new Date(v2.date);
			const today = new Date();
			if ((is_trainer && tkind == 'trainer' ||
			     !is_trainer && tkind == 'doctor') &&
			    (regdate.getFullYear() == today.getFullYear() &&
			     regdate.getMonth() == today.getMonth() &&
			     regdate.getDate() == today.getDate())) {
			    trclass += ' editable';
			}
			for (u in response.data[es_players]) {
			    if (response.data[es_players][u]['uid'] == v2.uid) {
				playerdata = response.data[es_players][u];
			    }
			}

			hText =
			    '<tr class="treatment_hist '+trclass+'" docid="'+docid+'" kind="'+tkind+'" player_name="'+h(playerdata.name)+'" staff_name="'+h(staffs[v2.treatment_uid].name)+'">'+
			    '<td rowspan="'+Object.keys(v2.s).length+'" class="rlist_no">'+treatment_no+'</td>'+
			    '<td rowspan="'+Object.keys(v2.s).length+'" class="rlist_date">'+v2.date.substr(0, 16)+'</td>';
			treatment_no--;
			if (player_uid == '*') {
			    hText +=
				'<td rowspan="'+Object.keys(v2.s).length+'" class="rlist_name">'+h(playerdata.name)+'</rd>';
			}
			if (staffs[v2.treatment_uid] != null) {
			    hText +=
				'<td rowspan="'+Object.keys(v2.s).length+'" class="rlist_name">'+h(staffs[v2.treatment_uid].name)+'</td>';
			} else {
			    hText +=
				'<td rowspan="'+Object.keys(v2.s).length+'" class_"rlist_name">不明</td>';
			}
		    
			$.each(v2.s, function(index, v3) {
			    if (index > 0) {
				hText +=
				    '<tr class="treatment_hist '+trclass+'" docid="'+docid+'" kind="'+tkind+'" player_name="'+h(playerdata.name)+'" staff_name="'+h(staffs[v2.treatment_uid].name)+'">';
			    }
			    hText +=
				'<td class="rlist_kind">'+(v3.kind == 0 ? 'ケガ' : '疾病')+'</td>';
			    if (v3.kind == 0) {
				hText
				    += '<td class="rlist_part">'+injury_parts[v3.injury_part];
				hText += '</td>';
				hText +=
				    '<td class="rlist_diag">'+injuries[v3.diagnosis]+'</td>';
				if (tkind == 'trainer') {
				    hText +=
					'<td class="rlist_treat">'+v3.treatment.map(x => treatmentstr[x]).join(', ')+'</td>';
				} else {
				    hText +=
					'<td class="rlist_treat"></td>';
				}
			    } else {
				hText +=
				    '<td class="rlist_part">'+organs[v3.organ]+'</td>'+
				    '<td class="rlist_diag">'+diseases[v3.disease]+'</td>'+
				    '<td class="rlist_treat"></td>';
			    }
			    hText +=
				'</tr>';
			});
		    }
		    e.append(hText);
		});
	    });
	});

    }
}
    
function go(docid, tkind) {
    let index;
    let type;
    let is_trainer_record;
    console.log(docid,tkind);
    $.mobile.loading('show');

    if (tkind == "trainer") {
	index = es_trainer_record;
	is_trainer_record = true;
    } else {
	index = es_doctor_record;
	is_trainer_record = false;
    }
    $.ajax({
	url: 'ajax/get_treatment_record_by_id.php',
	type: 'POST',
	dataType: 'json',
	data: { index: index, id: docid },
	timeout: 10000
    })
	.done(function(response){
	    console.log(response);
	    if (response.status == 'OK') {
		const tdata = response.data['s'];
		const date = response.data['date'];
		detach0 = []
		detach1 = [];
		ckind = [];
		canvas = [];
		$.each(tdata, function(index, v) {
		    add_treatment_page(is_trainer_record, v, docid, date);
		});
		$.mobile.loading('hide');
		$('body').pagecontainer('change', '#staff_treatment0', { transition: 'slide' });
	    } else {
		$.mobile.loading('hide');
		location.href = '../index.php';
		return false;
	    }
	})
	.fail(function(response){
	    console.log(response);
	    $.mobile.loading('hide');
	    return false;
	});
}

$(document).on('click', 'a.menu_addpage', function() {
    const is_trainer_record = ($('#is_trainer').val() == "1");
    const player_uid = $('#player_uid').val();
    for (u in players) {
	if (players[u].uid == player_uid) {
	    player_name = players[u].name;
	}
    }
    const staff_uid = $('#uid').val();
    staff_name = staffs[staff_uid].name;
    add_treatment_page(is_trainer_record, null, null, null);
    $('body').pagecontainer('change', '#staff_treatment0', { transition: 'slide' } );
});

$(document).on('click', 'tr.treatment_hist', function() {
    const docid = $(this).attr('docid');
    const tkind = $(this).attr('kind');
    player_name = $(this).attr('player_name');
    staff_name = $(this).attr('staff_name');
    go(docid, tkind);
});



// trainer page --------------------------------------------------------------------------------

function write_injury_input(index) {
    const is_trainer_record = ($('#is_trainer_record').val() == "1");
    let hText = '';
    var i;
    
    for (i = 0; i < 5; i++) {
	hText +=
	    '<div data-role="popup" id="popup_i['+index+']['+i+']" data-corners="false">'+
	    '<a href="#" data-rel="back" class="ui-btn ui-icon-delete ui-btn-right ui-btn-icon-notext ui-corner-all">Close</a>'+
	    '<img id="popupimg_i['+index+']['+i+']" src="" />'+
	    '</div>'+
	    '<div data-role="popup" id="popup_ix['+index+']['+i+']" data-corners="false">'+
	    '<a href="#" data-rel="back" class="ui-btn ui-icon-delete ui-btn-right ui-btn-icon-notext ui-corner-all">Close</a>'+
	    '<img id="popupimg_ix['+index+']['+i+']" src="" />'+
	    '</div>';
    }
    hText +=
	'<div class="ui-field-contain">'+
	'<label for="s['+index+'][injury_part]">ケガの部位</label>'+
	'<fieldset data-role="controlgroup" data-type="horizontal">'+
	'<label for="s['+index+'][injury_right]">右</label><input type="checkbox" name="s['+index+'][injury_right]" id="s['+index+'][injury_right]" value="1">'+
	'<label for="s['+index+'][injury_left]">左</label><input type="checkbox" name="s['+index+'][injury_left]" id="s['+index+'][injury_left]" value="1">'+
	'</div>'+
	'<div class="ui-field-contain">'+
	'<label></label>'+
	'<fieldset data-role="controlgroup" data-type="horizontal">'+
	'<label for="s['+index+'][injury_fore]">前方</label><input type="checkbox" name="s['+index+'][injury_fore]" id="s['+index+'][injury_fore]" value="1" class="ui-first-child">'+
	'<label for="s['+index+'][injury_back]">後方</label><input type="checkbox" name="s['+index+'][injury_back]" id="s['+index+'][injury_back]" value="1">'+
	'<label for="s['+index+'][injury_inside]">内側</label><input type="checkbox" name="s['+index+'][injury_inside]" id="s['+index+'][injury_inside]" value="1">'+
	'<label for="s['+index+'][injury_outside]">外側</label><input type="checkbox" name="s['+index+'][injury_outside]" id="s['+index+'][injury_outside]" value="1">'+
	'</fieldset>'+
	'</div>'+
	'<div class="ui-field-contain">'+
	'<label></label>'+
	'<select name="s['+index+'][injury_part]" id="s['+index+'][injury_part]" index="'+index+'" data-native-menu="false">'+
	'<option data-placeholder="true" value="">ケガの部位を選択</option>';
    for (i in injury_parts) {
	hText += '<option value="'+i+'">'+injury_parts[i]+'</option>';
    }
    hText +=
	'</select>'+
	'</div>';

    hText +=
	'<div class="ui-field-contain">'+
	'<label for="s['+index+'][injury_cause]">ケガの原因</label>'+
	'<select name="s['+index+'][injury_cause]" id="s['+index+'][injury_cause]" index="'+index+'" data-native-menu="false">'+
	'<option data-placeholder="true" value="">ケガの原因を選択</option>';
    for (i in injury_causes) {
	hText += '<option value="'+i+'">'+injury_causes[i]+'</option>';
    }
    hText +=
	'</select>'+
	'</div>';
    
    hText +=
	'<div class="ui-field-contain">'+
	'<label for="s['+index+'][diagnosis]">ケガの種類</label>'+
	'<select name="s['+index+'][diagnosis]" id="s['+index+'][diagnosis]" index="'+index+'" data-native-menu="false">'+
	'<option data-placeholder="true" value="">ケガの種類を選択</option>';
    for (i in injuries) {
	hText += '<option value="'+i+'">'+injuries[i]+'</option>';
    }
    hText +=
	'</select>'+
	'</div>';

    if (is_trainer_record == 1) {
	hText +=
	    '<div class="ui-field-contain">'+
	    '<label for="s['+index+'][treatment]">処置</label>'+
	    '<fieldset data-role="controlgroup" data-type="horizontal">'+
	    '<input type="checkbox" name="s['+index+'][treatment][]" id="s['+index+'][treatment][1]" value="1" class="treatment_checkbox" index="'+index+'">'+
	    '<label for="s['+index+'][treatment][1]">アイシング</label>'+
	    '<input type="checkbox" name="s['+index+'][treatment][]" id="s['+index+'][treatment][2]" value="2" class="treatment_checkbox" index="'+index+'">'+
	    '<label for="s['+index+'][treatment][2]">ストレッチ</label>'+
	    '<input type="checkbox" name="s['+index+'][treatment][]" id="s['+index+'][treatment][3]" value="3" class="treatment_checkbox" index="'+index+'">'+
	    '<label for="s['+index+'][treatment][3]">テーピング</label>'+
	    '<input type="checkbox" name="s['+index+'][treatment][]" id="s['+index+'][treatment][4]" value="4" class="treatment_checkbox" index="'+index+'">'+
	    '<label for="s['+index+'][treatment][4]">応急処置</label>'+
	    '<input type="checkbox" name="s['+index+'][treatment][]" id="s['+index+'][treatment][5]" value="5" class="treatment_checkbox" index="'+index+'">'+
	    '<label for="s['+index+'][treatment][5]">その他</label>'+
	    '</fieldset>'+
	    '</div>';
	hText +=
	    '<div class="ui-field-contain">'+
	    '<label for="s['+index+'][treatment_note]"></label>'+
	    '<textarea name="s['+index+'][treatment_note]" id="s['+index+'][treatment_note]"></textarea>'+
	    '</div>';
    }
    
    hText +=
	'<div class="ui-field-contain">'+
	'<label>中止予想期間</label>'+
	'<fieldset data-role="controlgroup" data-type="horizontal">'+
	'<input type="number" min="0" name="s['+index+'][daysorweeks]" index="'+index+'" data-wrapper-class="textinput_dw ui-btn ui-btn-inline">'+
	'<label><input type="radio" name="s['+index+'][dw_unit]" value="d" checked="checked">日</label>'+
	'<label><input type="radio" name="s['+index+'][dw_unit]" value="w">週</label>'+
	'</fieldset>'+
	'</div>';
    hText +=
	'<div class="ui-field-contain">'+
	'<label for="s['+index+'][comment]">コメント・連絡事項</label>'+
	'<textarea name="s['+index+'][comment]"></textarea>'+
	'</div>';
    hText +=
	'<div class="ui-field-contain">'+
	'<label for="s['+index+'][figure]">手書きメモ</label>'+
	'<input type="hidden" name="s['+index+'][figure]">'+
	'<a href="#staff_treatment'+index+'_fig" data-role="button" class="figbtn" data-transition="slide">手書き入力</a>'+
	'</div>'+
	'<div class="ui-field-contain">'+
	'<label for="s['+index+'][figure]"></label>'+
	'<a href="#popup_fig['+index+']" data-rel="popup" data-transition="pop" data-position-to="window"><img src="" id="s['+index+'][figure]" style="height:200px" /></a>'+
	'</div>';

    
    // dummy to prevent submit by enter key
    hText +=
    	'<input type="text" style="display:none;">';


    for (i = 0; i < 5; i++) {
	hText +=
	    '<div class="ui-field-contain regimg_i" index="'+index+'" p="'+i+'" style="display:none;">'+
	    '<label for="s['+index+'][photo_ix]['+i+']">登録画像'+(i+1)+'</label>';
	hText +=
	    '<fieldset data-role="controlgroup" data-type="horizontal">'+
	    '<a href="#popup_ix['+index+']['+i+']" data-rel="popup" data-transition="pop" data-position-to="window"><img id="s['+index+'][thumb_ix]['+i+']" style="height:200px" /></a>';
	hText +=
	    '<label><input type="checkbox" name="s['+index+'][photo_i_del][]" value="'+i+'" id="s['+index+'][photo_i_del]['+i+']" data-mini="true">削除</label>'+
	    '</fieldset>'+
	    '</div>';
    }
    
    for (i = 0; i < 5; i++) {
	hText +=
	    '<div class="ui-field-contain">'+
	    '<label for="s['+index+'][photo_i]['+i+']">画像'+(i+1)+'</label>'+
	    '<input type="file" name="s['+index+'][photo_i]['+i+']" id="s['+index+'][photo_i]['+i+']" num="'+i+'" class="ui-btn ui-corner-all" accept="image/*" capture="true">'+
	    '<label></label>'+
	    '<a href="#popup_i['+index+']['+i+']" data-rel="popup" data-transition="pop" data-position-to="window"><img id="s['+index+'][thumb_i]['+i+']" /></a>'+
	    '</div>';
    }

    $('#treatment_body'+index).append(hText);
    $('#treatment_body'+index).enhanceWithin();

    // validator
    $('select[name="s['+index+'][injury_part]"]').rules('add', {
    	required: true,
    	messages: {
    	    required: 'ケガの部位を選択してください。'
    	}
    });
    $('select[name="s['+index+'][injury_cause]"]').rules('add', {
    	required: true,
    	messages: {
    	    required: 'ケガの原因を選択してください。'
    	}
    });
    $('select[name="s['+index+'][diagnosis]"]').rules('add', {
    	required: true,
    	messages: {
    	    required: 'ケガの種類を選択してください。'
    	}
    });
    $('input[name="s['+index+'][treatment][]"]').rules('add', {
    	required: true,
    	messages: {
    	    required: '処置を選択してください。'
    	}
    });
    $('input[name="s['+index+'][daysorweeks]"]').rules('add', {
    	dayscheck: true,
    	messages: {
    	    required: '中止予想期間を入力してください。'
    	}
    });
    
    for (i = 0; i < 5; i++) {
	$('input[name="s['+index+'][photo_i]['+i+']"]').on('change',function(){
	    const j = $(this).attr('num');
	    console.log(j);
	    if (this.files.length > 0) {
		const file = this.files[0];
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function(){
		    console.log($('#s['+index+'][thumb_i]['+j+']'));
		    $('img[id="s['+index+'][thumb_i]['+j+']"]').attr('src', reader.result);
		    $('img[id="s['+index+'][thumb_i]['+j+']"]').attr('height', 200);
		    $('img[id="popupimg_i['+index+']['+j+']"]').attr('src', reader.result);
		};
	    }
	});
    }
    ckind[index] = 0;
}

function write_disease_input(index) {
    const is_trainer_record = ($('#is_trainer_record').val() == "1");
    let hText = '';
    var i;
    
    for (i = 0; i < 5; i++) {
	hText +=
	    '<div data-role="popup" id="popup_d['+index+']['+i+']" data-corners="false">'+
	    '<a href="#" data-rel="back" class="ui-btn ui-icon-delete ui-btn-right ui-btn-icon-notext ui-corner-all">Close</a>'+
	    '<img id="popupimg_d['+index+']['+i+']" src="" />'+
	    '</div>'+
	    '<div data-role="popup" id="popup_dx['+index+']['+i+']" data-corners="false">'+
	    '<a href="#" data-rel="back" class="ui-btn ui-icon-delete ui-btn-right ui-btn-icon-notext ui-corner-all">Close</a>'+
	    '<img id="popupimg_dx['+index+']['+i+']" src="" />'+
	    '</div>';
    }
    hText +=
	'<div class="ui-field-contain">'+
	'<label for="s['+index+'][disease_cause]">疾病の原因／症状</label>'+
	'<select name="s['+index+'][disease_cause]" id="s['+index+'][disease_cause]" index="'+index+'" data-native-menu="false">'+
	'<option data-placeholder="true" value="">疾病の原因／症状を選択</option>';
    for (i in disease_causes) {
	hText += '<option value="'+i+'">'+disease_causes[i]+'</option>';
    }
    hText +=
	'</select>'+
	'</div>';

    hText +=
	'<div class="ui-field-contain">'+
	'<label for="s['+index+'][organ]">関連臓器</label>'+
	'<select name="s['+index+'][organ]" id="s['+index+'][organ]" index="'+index+'" data-native-menu="false">'+
	'<option data-placeholder="true" value="">関連臓器を選択</option>';
    for (i in organs) {
	hText += '<option value="'+i+'">'+organs[i]+'</option>';
    }
    hText +=
	'</select>'+
	'</div>';

    hText +=
	'<div class="ui-field-contain">'+
	'<label for="s['+index+'][disease]">診断（主）</label>'+
	'<select name="s['+index+'][disease]" id="s['+index+'][disease]" index="'+index+'" data-native-menu="false">'+
	'<option data-placeholder="true" value="">診断（主）を選択</option>';
    for (i in diseases) {
	hText += '<option value="'+i+'">'+diseases[i]+'</option>';
    }
    hText +=
	'</select>'+
	'</div>';

    hText +=
	'<div class="ui-field-contain">'+
	'<label for="s['+index+'][disease_sub]">診断（副）</label>'+
	'<select name="s['+index+'][disease_sub][]" id="s['+index+'][disease_sub]" multiple="multiple" index="'+index+'" data-native-menu="false">'+
	'<option data-placeholder="true" value="">診断（副）を選択</option>';
    for (i in diseases) {
	hText += '<option value="'+i+'">'+diseases[i]+'</option>';
    }
    hText +=
	'</select>'+
	'</div>';

    hText +=
	'<div class="ui-field-contain">'+
	'<label>中止予想期間</label>'+
	'<fieldset data-role="controlgroup" data-type="horizontal">'+
	'<input type="number" min="0" name="s['+index+'][daysorweeks]" index="'+index+'" data-wrapper-class="textinput_dw ui-btn ui-btn-inline">'+
	'<label><input type="radio" name="s['+index+'][dw_unit]" value="d" checked="checked">日</label>'+
	'<label><input type="radio" name="s['+index+'][dw_unit]" value="w">週</label>'+
	'</fieldset>'+
	'</div>';
    hText +=
	'<div class="ui-field-contain">'+
	'<label for="s['+index+'][comment]">コメント・連絡事項</label>'+
	'<textarea name="s['+index+'][comment]"></textarea>'+
	'</div>';

    hText +=
	'<div class="ui-field-contain">'+
	'<label for="s['+index+'][figure]">手書きメモ</label>'+
	'<input type="hidden" name="s['+index+'][figure]">'+
	'<a href="#staff_treatment'+index+'_fig" data-role="button" class="figbtn" data-transition="slide">手書き入力</a>'+
	'</div>'+
	'<div class="ui-field-contain">'+
	'<label for="s['+index+'][figure]"></label>'+
	'<a href="#popup_fig['+index+']" data-rel="popup" data-transition="pop" data-position-to="window"><img src="" id="s['+index+'][figure]" style="height:200px" /></a>'+
	'</div>';
    
    // dummy to prevent submit by enter key
    hText +=
    	'<input type="text" style="display:none;">';

    for (i = 0; i < 5; i++) {
	hText +=
	    '<div class="ui-field-contain regimg_d" index="'+index+'" p="'+i+'" style="display:none;">'+
	    '<label for="s['+index+'][photo_dx]['+i+']">登録画像'+(i+1)+'</label>';
	hText +=
	    '<fieldset data-role="controlgroup" data-type="horizontal">'+
	    '<a href="#popup_dx['+index+']['+i+']" data-rel="popup" data-transition="pop" data-position-to="window"><img id="s['+index+'][thumb_dx]['+i+']" style="height:200px" /></a>';
	hText +=
	    '<label><input type="checkbox" name="s['+index+'][photo_d_del][]" value="'+i+'" id="s['+index+'][photo_d_del]['+i+']" data-mini="true">削除</label>'+
	    '</fieldset>'+
	    '</div>';
    }

    for (i = 0; i < 5; i++) {
	hText +=
	    '<div class="ui-field-contain">'+
	    '<label for="s['+index+'][photo_d]['+i+']">画像'+(i+1)+'</label>'+
	    '<input type="file" name="s['+index+'][photo_d]['+i+']" id="s['+index+'][photo_d]['+i+']" num="'+i+'" class="ui-btn ui-corner-all" accept="image/*" capture="true">'+
	    '<label></label>'+
	    '<a href="#popup_d['+index+']['+i+']" data-rel="popup" data-transition="pop" data-position-to="window"><img id="s['+index+'][thumb_d]['+i+']" /></a>'+
	    '</div>';
    }

    $('#treatment_body'+index).append(hText);
    $('#treatment_body'+index).enhanceWithin();

    // validator
    $('select[name="s['+index+'][disease_cause]"]').rules('add', {
    	required: true,
    	messages: {
    	    required: '疾病の原因を選択してください。'
    	}
    });
    $('select[name="s['+index+'][organ]"]').rules('add', {
    	required: true,
    	messages: {
    	    required: '関連臓器を選択してください。'
    	}
    });
    $('select[name="s['+index+'][disease]"]').rules('add', {
    	required: true,
    	messages: {
    	    required: '診断（主）を選択してください。'
    	}
    });
    $('input[name="s['+index+'][daysorweeks]"]').rules('add', {
    	dayscheck: true,
    	messages: {
    	    required: '中止予想期間を入力してください。'
    	}
    });
    
    for (i = 0; i < 5; i++) {
	$('input[name="s['+index+'][photo_d]['+i+']"]').on('change',function(){
	    var j = $(this).attr('num');
	    console.log(j);
	    if (this.files.length > 0) {
		var file = this.files[0];
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function(){
		    console.log($('#s['+index+'][thumb_d]['+j+']'));
		    $('img[id="s['+index+'][thumb_d]['+j+']"]').attr('src', reader.result);
		    $('img[id="s['+index+'][thumb_d]['+j+']"]').attr('height', 200);
		    $('img[id="popupimg_d['+index+']['+j+'"]').attr('src', reader.result);
		};
	    }
	});
    }
    ckind[index] = 1;
}

function add_treatment_page(is_trainer_record, tdata, docid, date) {
    const is_trainer = ($('#is_trainer').val() == "1");
    const index = $('.treatment_page').length;
    var j;
    
    editable = true;
    if (is_trainer && !is_trainer_record ||
        !is_trainer && is_trainer_record) {
	editable = false;
    } else if (date != null) {
	const regdate = new Date(date);
	const today = new Date();

	editable = (regdate.getFullYear() == today.getFullYear() &&
		    regdate.getMonth() == today.getMonth() &&
		    regdate.getDate() == today.getDate());
    }

    let hText = 
	'<div id="staff_treatment'+index+'" data-role="page" class="treatment_page" index="'+index+'">'+
	'<form id="staff_treatment_form['+index+']" index="'+index+'">'+
	'<div data-role="header" data-position="fixed" data-tap-toggle="false">'+
	'<h1>'+(is_trainer_record ? '処置' : '診療')+'記録'+(tdata === null ? '入力' : (editable && !browseonly) ? '編集' : '閲覧')+' <span id="disppage'+index+'"></span></h1>'+
	'<a href="#" data-role="button" data-theme="b" data-icon="check" class="ui-btn-right form_submit" data-ajax="false">登録</a>'+
	'</div>'+
	'<div class="ui-content" role="main">';
    if (index == 0) {
	hText += 
	    '<input type="hidden" id="is_trainer_record" value="'+(is_trainer_record ? 1 : 0)+'" />';
    }
    if (date !== null) {
	hText +=
	    '<div style="text-align: right;">入力日時: '+h(date)+'</div>';
    }
    if (player_name !== null) {
	hText +=
	    '<div style="text-align: right;">選手名: '+h(player_name)+'</div>';
    }
    if (staff_name !== null) {
	hText +=
	    '<div style="text-align: right;">処置・診療者: '+h(staff_name)+'</div>';
    }
    hText +=
	'<div class="ui-field-contain">'+
	'<label for="s['+index+'][kind]">処置種別</label>'+
	'<fieldset data-role="controlgroup" data-type="horizontal">'+
	'<label><input type="radio" name="s['+index+'][kind]" index="'+index+'" class="treatment_kind" value="0"'+(tdata === null || tdata.kind == 0 ? ' selected="selected"' : '')+'>ケガ</label>'+
	'<label><input type="radio" name="s['+index+'][kind]" index="'+index+'" class="treatment_kind" value="1"'+(tdata !== null && tdata.kind == 1 ? ' selected="selected"' : '')+'>疾病</label>'+
	'</fieldset>'+
	'</div>'+
	'<div id="treatment_body'+index+'">'+
	'</div>'+
	'<div data-role="popup" id="popup_fig['+index+']" data-corners="false">'+
	'<a href="#" data-rel="back" class="ui-btn ui-icon-delete ui-btn-right ui-btn-icon-notext ui-corner-all">Close</a>'+
	'<img id="popupimg_fig['+index+']" src="" />'+
	'</div>'+
	'</div>'+
	'<div data-role="footer" data-position="fixed" data-tap-toggle="false">'+
	'<div class="ui-bar">'+
	'</div>'+
	'</div>';
    if (docid !== null) {
	hText +=
	    '<input type="hidden" name="docid" value="'+docid+'">';
    }
    if (date !== null) {
	hText +=
	    '<input type="hidden" name="date" value="'+date+'">';
    }
    hText +=
	'</form>'+
	'</div>';

    // canvas
    hText += 
	'<div id="staff_treatment'+index+'_fig" data-role="page" class="drawfig_page" index="'+index+'">'+
	'<div class="ui-content" role="main" id="drawfig'+index+'_main">'+
	'<canvas id="canvas_'+index+'" style="border:1px solid black"></canvas>'+
	'<fieldset data-role="controlgroup" data-type="horizontal">'+
	'<label><input type="radio" name="pentype" class="pentype" value="black1" checked="checked">黒1</label>'+
	'<label><input type="radio" name="pentype" class="pentype" value="black2">黒2</label>'+
	'<label><input type="radio" name="pentype" class="pentype" value="red1">赤1</label>'+
	'<label><input type="radio" name="pentype" class="pentype" value="red2">赤2</label>'+
	'<label><input type="radio" name="pentype" class="pentype" value="eraser">消しゴム</label>'+
	'</fieldset>'+
	'<button type="button" data-inline="true" class="clearfig">クリア</button>'+
	'</div>'+
	'<div data-role="footer" data-position="fixed" data-tap-toggle="false">'+
	'<div class="ui-bar">'+
	'<button type="button" class="drawfin" data-theme="b" index="'+index+'">反映して戻る</button>'+
	'</div>'+
	'</div>'+
	'</div>';

    $('body').append(hText);
    $('body').enhanceWithin();

    // canvas
    canvas[index] = new fabric.Canvas('canvas_'+index, { isDrawingMode: true, backgroundColor: '#fff', selection: true });
    canvas[index].setWidth(800);
    canvas[index].setHeight(800);
    canvas[index].renderAll();
    canvas[index].freeDrawingBrush.color = '#000';
    canvas[index].freeDrawingBrush.width = 1;

    if (tdata === null || tdata.kind == 0) {
	$('input[name="s['+index+'][kind]"]').val([0]);
	$('input[name="s['+index+'][kind]"]').checkboxradio('refresh');
	write_injury_input(index);
	if (tdata !== null) {
	    // set data
	    if (tdata.injury_right != null && tdata.injury_right == 1) {
		$('input[name="s['+index+'][injury_right]"]').val([1]);
	    }
	    if (tdata.injury_left != null && tdata.injury_left == 1) {
		$('input[name="s['+index+'][injury_left]"]').val([1]);
	    }
	    if (tdata.injury_fore != null && tdata.injury_fore == 1) {
		$('input[name="s['+index+'][injury_fore]"]').val([1]);
	    }
	    if (tdata.injury_back != null && tdata.injury_back == 1) {
		$('input[name="s['+index+'][injury_back]"]').val([1]);
	    }
	    if (tdata.injury_inside != null && tdata.injury_inside == 1) {
		$('input[name="s['+index+'][injury_inside]"]').val([1]);
	    }
	    if (tdata.injury_outside != null && tdata.injury_outside == 1) {
		$('input[name="s['+index+'][injury_outside]"]').val([1]);
	    }
	    $('select[name="s['+index+'][injury_part]"]').val(tdata.injury_part);
	    $('select[name="s['+index+'][injury_cause]"]').val(tdata.injury_cause);
	    $('select[name="s['+index+'][diagnosis]"]').val(tdata.diagnosis);
	    if (is_trainer) {
		$('input[name="s['+index+'][treatment][]"]').val(tdata.treatment);
		$('textarea[name="s['+index+'][treatment_note]"]').val(tdata.treatment_note);
	    }
	    $('input[name="s['+index+'][daysorweeks]"]').val(tdata.daysorweeks);
	    $('input[name="s['+index+'][dw_unit]"]').val([tdata.dw_unit]);
	    $('textarea[name="s['+index+'][comment]"]').val(tdata.comment);
	    if (tdata.photo_i != null) {
		for (j = 0; j < 5; j++) {
		    if (tdata.photo_i[j] != null) {
			$('img[id="s['+index+'][thumb_ix]['+j+']"]').attr('src', tdata.photo_i[j]);
			$('img[id="popupimg_ix['+index+']['+j+']"]').attr('src', tdata.photo_i[j]);
			$('div.regimg_i[index="'+index+'"][p="'+j+'"]').show();
		    }
		}
	    }

	    if (tdata.figure != null && tdata.figure != '') {
		canvas[index].loadFromDatalessJSON(tdata.figure, function() {
		    canvas[index].renderAll();
		    $('input[name="s['+index+'][figure]"]').val(tdata.figure);
		});
	    }
	    
	    $('input[name="s['+index+'][injury_right]"]').checkboxradio('refresh');
	    $('input[name="s['+index+'][injury_left]"]').checkboxradio('refresh');
	    $('input[name="s['+index+'][injury_fore]"]').checkboxradio('refresh');
	    $('input[name="s['+index+'][injury_back]"]').checkboxradio('refresh');
	    $('input[name="s['+index+'][injury_inside]"]').checkboxradio('refresh');
	    $('input[name="s['+index+'][injury_outside]"]').checkboxradio('refresh');
	    $('select[name="s['+index+'][injury_part]"]').selectmenu('refresh');
	    $('select[name="s['+index+'][injury_cause]"]').selectmenu('refresh');
	    $('select[name="s['+index+'][diagnosis]"]').selectmenu('refresh');
	    $('input[name="s['+index+'][treatment][]"]').checkboxradio('refresh');
	    $('input[name="s['+index+'][dw_unit]"]').checkboxradio('refresh');
	}
	
    } else {
	$('input[name="s['+index+'][kind]"]').val([1]);
	$('input[name="s['+index+'][kind]"]').checkboxradio('refresh');
	write_disease_input(index);
	
	$('select[name="s['+index+'][disease_cause]"]').val(tdata.disease_cause);
	$('select[name="s['+index+'][organ]"]').val(tdata.organ);
	$('select[name="s['+index+'][disease]"]').val(tdata.disease);
	if (tdata.disease_sub != null) {
	    $('select[name="s['+index+'][disease_sub][]"]').val(tdata.disease_sub);
	}
	$('input[name="s['+index+'][daysorweeks]"]').val(tdata.daysorweeks);
	$('input[name="s['+index+'][dw_unit]"]').val([tdata.dw_unit]);
	$('textarea[name="s['+index+'][comment]"]').val(tdata.comment);

	if (tdata.photo_d != null) {
	    for (j = 0; j < 5; j++) {
		if (tdata.photo_d[j] != null) {
		    $('img[id="s['+index+'][thumb_dx]['+j+']"]').attr('src', tdata.photo_d[j]);
		    $('img[id="popupimg_dx['+index+']['+j+']"]').attr('src', tdata.photo_d[j]);
		    $('div.regimg_d[index="'+index+'"][p="'+j+'"]').show();
		}
	    }
	}
	
	if (tdata.figure != null && tdata.figure != '') {
	    canvas[index].loadFromDatalessJSON(tdata.figure, function() {
		canvas[index].renderAll();
		$('input[name="s['+index+'][figure]"]').val(tdata.figure);
	    });
	}

	$('select[name="s['+index+'][disease_cause]"]').selectmenu('refresh');
	$('select[name="s['+index+'][organ]"]').selectmenu('refresh');
	$('select[name="s['+index+'][disease]"]').selectmenu('refresh');
	$('select[name="s['+index+'][disease_sub][]"]').selectmenu('refresh');
	$('input[name="s['+index+'][dw_unit]"]').checkboxradio('refresh');
    }

    const png = canvas[index].toDataURL('png');
    $('img[id="s['+index+'][figure]"]').attr('src', png);
    $('img[id="popupimg_fig['+index+']"]').attr('src', png);

    if (!editable || browseonly) {
	$('form :input').attr('disabled', 'disabled');

	$('form select').selectmenu('disable');
	$('form input[type="radio"]').checkboxradio('disable');
	$('form input[type="checkbox"]').checkboxradio('disable');
	$('a.form_submit').hide();
	$('a.figbtn').hide();
    }
    
}

$(document).on('change', 'input.pentype', function() {
    const index = $(this).closest('div[index]').attr('index');
    const sel = $(this).val();
    switch (sel) {
    case 'black1':
	canvas[index].freeDrawingBrush.color = '#000000';
	canvas[index].freeDrawingBrush.width = 1;
	break;
    case 'black2':
	canvas[index].freeDrawingBrush.color = '#000000';
	canvas[index].freeDrawingBrush.width = 2;
	break;
    case 'red1':
	canvas[index].freeDrawingBrush.color = '#ff0000';
	canvas[index].freeDrawingBrush.width = 1;
	break;
    case 'red2':
	canvas[index].freeDrawingBrush.color = '#ff0000';
	canvas[index].freeDrawingBrush.width = 2;
	break;
    case 'eraser':
	canvas[index].freeDrawingBrush.color = '#ffffff';
	canvas[index].freeDrawingBrush.width = 30;
	break;
    }
});

$(document).on('click', 'button.clearfig', function() {
    const index = $(this).closest('div[index]').attr('index');
    canvas[index].clear();
    canvas[index].backgroundColor = '#fff';
    canvas[index].renderTop();
});

$(document).on('click', 'button.drawfin', function() {
    const index = $(this).attr('index');
    const png = canvas[index].toDataURL('png');
    const json = canvas[index].toDatalessJSON();
    $('input[name="s['+index+'][figure]"]').val(JSON.stringify(json));
    $('img[id="s['+index+'][figure]"]').attr('src', png);
    $('img[id="popupimg_fig['+index+']"]').attr('src', png);
    console.log(json);
    console.log('png'+index);
    $('body').pagecontainer('change', '#staff_treatment'+index, { transition: 'slide', reverse: true });
});



$(document).on('click', 'a.form_submit', function() {
    // ... disable buttons
    $(this).addClass('ui-disabled');
    
    var firstError;
    $('form').each(function() {
	if (!$(this).valid()) {
	    if (firstError == null) {
		firstError = $(this).find(":input.error:first");
	    }
	}
    });
    if (firstError != null) {
	var idErrorPage = firstError.parents('div:jqmData(role="page")').attr('id');
	$(this).removeClass('ui-disabled');
	$('body').pagecontainer('change', '#'+idErrorPage);
	firstError.focus();
	return false;
    }
    
    $.mobile.loading('show');
    const formdata = new FormData();
    $.each($('form'), function(i,v) {
	const files = $('input[type="file"]:not([disabled])', v);
	files.each(function(_, input) {
	    if (input.files.length > 0) return;
	    $(input).prop('disabled', true);
	});
	const formdata2 = new FormData(v);
	for (let fd of formdata2) {
	    console.log(fd);
	    formdata.append(fd[0], fd[1]);
	}
    });

    $.ajax({
	url: 'ajax/upsert_treatment_record.php',
	method: 'post',
	dataType: 'json',
	processData: false,
	contentType: false,
	data: formdata,
	timeout: 30000
    }).done(function(response){
	console.log('done');
	console.log(response);
	$('.treatment_page').remove();
	$('body').pagecontainer('change', '#staff_treatment_list', { transition: 'slide', reverse: true});
	$.mobile.loading('hide');
    }).fail(function(jqXHR,textStatus,errorThrown){
	console.log('fail', jqXHR, textStatus, errorThrown);
	$.mobile.loading('hide');
    });
    return false;
});

$(document).on('pagecreate', 'div.treatment_page', function() {
    const index = $(this).attr('index');
    const form = $('form[index="'+index+'"]');
    form.validate({
	errorPlacement: function(error, element) {
	    if (element.attr('name').match(/treatment|daysorweeks/)) {
		error.insertAfter(element.parents('fieldset'));
	    } else {
		error.insertAfter(element.parent());
	    }
	},
	ignore: ''

    });
    $.validator.addMethod('dayscheck', function(val, elem, params) {
	var c = elem.attributes['index'].value;
	return (parseInt(val)>=0 && $('input[name="s['+c+'][dw_unit]"]:checked').val() != null);
    }, '中止予想期間を入力してください。');

});

$(document).on('change', 'select.error', function() {
    const index = $(this).attr('index');
    const form = $('form[index="'+index+'"]');
    form.valid();
});

$(document).on('change', 'input.treatment_checkbox', function() {
    console.log('changed');
    const index = $(this).attr('index');
    const form = $('form[index="'+index+'"]');
    const firstelem = $('#s\\['+index+'\\]\\[treatment\\]\\[1\\]');
    if (firstelem.hasClass('error')) {
	console.log(form.valid());
    }
});


$(document).on('pagebeforeshow', 'div.treatment_page', function() {
    const thisindex = parseInt($(this).attr('index'));
    const len = $('.treatment_page').length;
    console.log((thisindex+1) + '/' + len);

    // insert page numer
    $('#disppage'+thisindex).html((thisindex+1) + '/' + len);
    // insert prev/next buttons
    const footer = $('#staff_treatment'+thisindex+' div[data-role="footer"] div');
    footer.empty();
    if (thisindex == 0) {
	footer.append(
	    '<a href="#staff_treatment_list" data-role="button" data-theme="b" data-icon="back" data-transition="slide" data-direction="reverse">一覧に戻る</a>'
	);
    } else {
	footer.append(
	    '<a href="#staff_treatment'+(thisindex-1)+'" data-role="button" data-theme="b" data-icon="arrow-l" data-transition="slide" data-direction="reverse">'+(thisindex)+' / '+len+'へ</a>'
	);
    }	    
    if (thisindex+1 == len) {
	if (editable && !browseonly) {
	    footer.append(
		'<a href="#" data-role="button" data-theme="b" data-icon="plus" style="float:right" id="addpage" class="addpage" index="'+thisindex+'">シート追加</a>'
	    );
	}
    } else {
	footer.append(
	    '<a href="#staff_treatment'+(thisindex+1)+'" data-role="button" data-theme="b" data-icon="arrow-r" data-iconpos="right" style="float:right" data-transition="slide">'+(thisindex+2)+' / '+len+'へ</a>'
	);
    }
    
    footer.enhanceWithin();
    return false;
    
});

$(document).on('click', 'a.addpage', function() {
    const is_trainer_record = ($('#is_trainer_record').val() == "1");
    const index = $(this).attr('index');
    if (!$('form[index="'+index+'"]').valid()) {
	return false;
    }
    const len = $('.treatment_page').length;
    let conf = confirm('シート（'+(len+1)+'枚目）を追加します。');
    if (conf) {
	let tdata = new Object();
	tdata.kind = $('input[name="s['+index+'][kind]"]:checked').val();
	if (tdata.kind == 0) {
	    tdata.injury_right = $('input[name="s['+index+'][injury_right]"]:checked').val();
	    tdata.injury_left = $('input[name="s['+index+'][injury_left]"]:checked').val();
	    tdata.injury_fore = $('input[name="s['+index+'][injury_fore]"]:checked').val();
	    tdata.injury_back = $('input[name="s['+index+'][injury_back]"]:checked').val();
	    tdata.injury_inside = $('input[name="s['+index+'][injury_inside]"]:checked').val();
	    tdata.injury_outside = $('input[name="s['+index+'][injury_outside]"]:checked').val();
	    tdata.injury_part = $('select[name="s['+index+'][injury_part]"]').val();
	    tdata.injury_cause = $('select[name="s['+index+'][injury_cause]"]').val();
	    tdata.diagnosis = $('select[name="s['+index+'][diagnosis]"]').val();
	    if (is_trainer_record) {
		tdata.treatment = $('input[name="s['+index+'][treatment][]"]:checked').map(function(){return $(this).val();}).get();
		tdata.treatment_note = $('textarea[name="s['+index+'][treatment_note]"]').val();
	    }
	    tdata.daysorweeks = $('input[name="s['+index+'][daysorweeks]"]').val();
	    tdata.dw_unit = $('input[name="s['+index+'][dw_unit]"]:checked').val();
	} else {
	    tdata.disease_cause = $('select[name="s['+index+'][disease_cause]"]').val();
	    tdata.organ = $('select[name="s['+index+'][organ]"]').val();
	    tdata.disease = $('select[name="s['+index+'][disease]"]').val();
	    tdata.disease_sub = $('select[name="s['+index+'][disease_sub][]"]').val();
	    tdata.daysorweeks = $('input[name="s['+index+'][daysorweeks]"]').val();
	    tdata.dw_unit = $('input[name="s['+index+'][dw_unit]"]:checked').val();
	}
	
	add_treatment_page(is_trainer_record, tdata, null, null);
	$('body').pagecontainer('change', '#staff_treatment'+len, { transition: 'slide' } );
    }
});


$(document).on('swiperight', '.treatment_page', function() {
    const thisindex = parseInt($(this).attr('index'));
    $('body').pagecontainer('change', '#staff_treatment'+(thisindex-1), { transition: 'slide', reverse: true});
    return false;
});

$(document).on('swipeleft', '.treatment_page', function(){
    const thisindex = parseInt($(this).attr('index'));
    $('body').pagecontainer('change', '#staff_treatment'+(thisindex+1), { transition: 'slide' });
    return false;
});

$(document).on('change', 'input.treatment_kind', function() {
    const index = $(this).attr("index");
    const kind = $(this).val();
    const is_trainer_record = ($('#is_trainer').val() == "1");
    console.log('change' + index+' '+kind);
    if (kind == 0) {
	if (ckind[index] == 1 && $('#treatment_body'+index).children().length > 0) {
	    detach1[index] = $('#treatment_body'+index).children().detach();
	    console.log(detach1);
	}
	ckind[index] = 0;
	if (detach0[index] != null) {
	    $('#treatment_body'+index).append(detach0[index]);
	    $('#treatment_body'+index).enhanceWithin();
	} else {
	    write_injury_input(index);
	}
    } else {
	if (ckind[index] == 0 && $('#treatment_body'+index).children().length > 0) {
	    detach0[index] = $('#treatment_body'+index).children().detach();
	}
	ckind[index] = 1;
	if (detach1[index] != null) {
	    $('#treatment_body'+index).append(detach1[index]);
	    $('#treatment_body'+index).enhanceWithin();
	} else {
	    write_disease_input(index);
	}
    }
    const png = canvas[index].toDataURL('png');
    const json = canvas[index].toDatalessJSON();
    $('input[name="s['+index+'][figure]"]').val(JSON.stringify(json));
    $('img[id="s['+index+'][figure]"]').attr('src', png);
    $('img[id="popupimg_fig['+index+']"]').attr('src', png);
    
});
