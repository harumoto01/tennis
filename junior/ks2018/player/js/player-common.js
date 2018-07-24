var responsecache;
var playerdata;
var age;


// menu page

function write_data(response) {
    console.log('write_data');
    var docid;
    $('#menu_div1').empty();
    if (response.status != 'OK' || response.data.length == 0 || response.data[es_players] == null) {
//	e.append('選手情報の取得に失敗しました。');
	return false;
    }
    var v = response.data;
    playerdata = v[es_players];
    
    if (v[es_sheet1] == null) {
	$('#menu_div1').append(
	    '<form method="POST" action="sheet1.php" data-ajax="false">'
		+ '<button type="submit" style="height: 5em">新規登録</buttion>'
		+ '</form>'
	);
    } else {
	for (docid in v[es_sheet1]) {
	    const regdate = new Date(v[es_sheet1][docid].date);
	    $('#menu_div1').append(
		'<form method="POST" action="sheet1.php" data-ajax="false" style="display:inline-block;width:60%">'
		    + '<input type="hidden" name="docid" value="' + docid + '" />'
		    + '<button type="submit" data-icon="edit" style="height:5em">' + (regdate.getMonth()+1) + '月' + regdate.getDate() + '日 登録</buttion>'
		    + '</form>'
	    );
	    $('#menu_div1').append(
		'<form method="POST" action="sheet1pdf.php" data-ajax="false" style="display:inline-block;width:40%">'
//		    + '<input type="hidden" name="docid" value="' + docid + '" />'
		    + '<button type="submit" data-icon="action" style="height:5em">印刷用PDF出力</buttion>'
		    + '</form>'
	    );
	}
    }
    $('#menu_div1').enhanceWithin();

    var registered_today = false;
    $('#menu_div2').empty();
    if (v[es_sheet2] != null) {
	const today = new Date();
	$.each(v[es_sheet2], function(docid, v3) {
	    const regdate = new Date(v3.date);
	    if (regdate.getFullYear() == today.getFullYear() &&
		regdate.getMonth() == today.getMonth() &&
		regdate.getDate() == today.getDate()) {
		registered_today = true;
	    }
	    $('#menu_div2').append(
		'<form method="POST" action="sheet2.php" data-ajax="false" style="display:inline-block;width:60%">'
		    + '<input type="hidden" name="docid" value="' + docid + '" />'
		    + '<button type="submit" data-icon="edit" style="height:5em">' + (regdate.getMonth()+1) + '月' + regdate.getDate() + '日分</buttion>'
		    + '</form>'
	    );
	    $('#menu_div2').append(
		'<form method="POST" action="sheet2pdf.php" data-ajax="false" style="display: inline-block;width:40%">'
		    + '<input type="hidden" name="docid" value="' + docid + '" />'
		    + '<button type="submit" data-icon="action" style="height:5em">印刷用PDF出力</buttion>'
		    + '</form>'
	    );
	});
    }
    if (!registered_today) {
	const today = new Date();
	const fromdate = new Date(2018, 6, 12, 0, 0, 0); // monthは0起点
	const uid = Object.keys(playerdata)[0];
	if (today.getTime() >= fromdate.getTime() || uid.match(/^ks\d{4}$/)) {
//	if (today.getTime() >= fromdate.getTime()) {
	    $('#menu_div2').prepend(
		'<form method="POST" action="sheet2.php" data-ajax="false">'
		    + '<button type="submit" style="height: 5em">本日分新規登録</buttion>'
		    + '</form>'
	    );
	} else {
	    $('#menu_div2').prepend(
		'<form method="POST" action="sheet2.php" data-ajax="false">'
		    + '<button type="submit" style="height: 5em" class="ui-disabled">本日分新規登録</buttion>'
		    + '</form>'
	    );
	}
    }
    $('#menu_div2').enhanceWithin();

}

$(document).on('pagebeforeshow','#menu_p1', function() {
    console.log('pagebeforeshow:menu_p1');
    $.mobile.loading('show');

    $.ajax({
	url: 'ajax/get_alldata_by_uid.php',
	type: 'POST',
	dataType: 'json',
	data: { index: es_players+','+es_sheet1+','+es_sheet2,
		filter: { uid: $('#uid').val() } },
	timeout: 10000
    })
	.done(function(response) {
	    console.log(response);
	    responsecache = response;
	    write_data(responsecache);
	    
	    $.mobile.loading('hide');
	})
	.fail(function() {
	    $.mobile.loading('hide');
	    console.log('fail');
	    return false;
	});
});

// sheet1/index.php
var s1data;
var editable;

function medhist_add_item() {
    var y, m;
    const cnt = $('.medhist').length + 1;
    var hText = 
	'<div class="ui-field-contain medhist" index="'+cnt+'">'+
	'<label for="medhist['+cnt+'][kind]">病名</label>'+
	'<select name="medhist['+cnt+'][kind]" index="'+cnt+'" class="s1medhist" data-native-menu="false">'+
	'<option data-placeholder="true" value="">病名を選択</option>';
    $.each(disnames, function(i, v) {
	hText += '<option value="'+i+'">'+v+'</option>';
    });
    hText +=
	'</select>'+
	'<label for="medhist['+cnt+'][disname]"></label>'+
	'<input type="text" name="medhist['+cnt+'][disname]" placeholder="病名" index="'+cnt+'" class="s1medhist_disname">'+
	'<label for="medhist['+cnt+'][hospname]"></label>'+
	'<input type="text" name="medhist['+cnt+'][hospname]" placeholder="医療機関名" index="'+cnt+'" class="s1medhist_hospname">'+
	'<label for="medhist['+cnt+'][age]">発症年齢</label>'+
	'<select name="medhist['+cnt+'][age]" data-native-menu="false" index="'+cnt+'" class="s1medhist_age">'+
	'<option data-placeholder="true" value="">発症年齢を選択</option>';
    $.each(ages, function(i, v) {
	if (i != 'now' && i <= age) {
	    hText += '<option value="'+i+'">'+v+'</option>';
	}
    });
    hText +=
	'</select>'+
	'<label>罹患期間</label>'+
	'<fieldset data-role="controlgroup" data-type="horizontal">'+
	'<select name="medhist['+cnt+'][period_year]" data-native-menu="false" index="'+cnt+'" class="s1medhist_period_year">'+
	'<option data-placeholder="true" value="">年</option>';
    for (y = 0; y <= 10; y++) {
	hText +=
	    '<option value="' + y + '">' + y + '年</option>';
    }
    hText +=
	'</select>'+
	'<select name="medhist['+cnt+'][period_month]" data-native-menu="false" index="'+cnt+'" class="s1medhist_period_month">'+
	'<option data-placeholder="true" value="">ケ月</option>';
    for (m = 0; m <= 11; m++) {
	hText +=
	    '<option value="' + m + '">' + m + 'ケ月</option>';
    }
    hText +=
	'</select>'+
	'</fieldset>'+
	'</div>';

    $('#medhist').append(hText);

    return cnt;
}

function pain_add_item() {
    const cnt = $('.pain').length + 1;
    var hText = '';
    hText +=
        '<div class="ui-field-contain pain">'+
	'<label for="pain['+cnt+'][kind]">痛み・ケガの部位</label>'+
	'<select name="pain['+cnt+'][kind]" index="'+cnt+'" class="s1pain" data-native-menu="false">'+
	'<option data-placeholder="true" value="">痛み・ケガの部位を選択</option>';
    $.each(bodyparts_p, function(i, v) {
	hText += '<option value="'+i+'">'+v+'</option>';
    });
    hText +=
	'</select>'+
	'<label for="pain['+cnt+'][part]"></label>'+
	'<input type="text" name="pain['+cnt+'][part]" index="'+cnt+'" class="s1pain_part" placeholder="部位">'+
	'<div data-role="rangeslider">'+
	'<label for="pain['+cnt+'][age_from]">年齢</label>'+
	'<input type="range" name="pain['+cnt+'][age_from]" index="'+cnt+'" class="s1agerange s1agerangefrom" min="0" max="'+(age+1)+'" value="'+Math.floor(age/3)+'">'+
	'<label for="pain['+cnt+'][age_to]">年齢</label>'+
	'<input type="range" name="pain['+cnt+'][age_to]" index="'+cnt+'" class="s1agerange s1agerangeto" min="0" max="'+(age+1)+'" value="'+Math.floor(age/3*2)+'">'+
	'</div>'+
	'<div name="pain['+cnt+'][agestr]" class="age_range">'+Math.floor(age/3)+'歳 〜 '+Math.floor(age/3*2)+'歳</div>'+
	'</div>';
    $('#pain').append(hText);

    return cnt;
}


$(document).on('pagecreate', '#sheet1_p1', function() {
    console.log('pagecreate: sheet1_p1');

    $.mobile.loading('show');
    $.ajax({
	url: 'ajax/get_alldata_by_uid.php',
	type: 'POST',
	dataType: 'json',
	data: { index: es_players+','+es_sheet1,
		filter: { uid: $('#uid').val() } },
	timeout: 10000
    })
	.done(function(response) {
//	    console.log(response);
	    var i;
	    var hText;
	    var data;
	    playerdata = response.data[es_players][Object.keys(response.data[es_players])[0]];
	    
	    // calculate age
	    const bd = new Date(playerdata.birthdate);
	    const today = new Date();
	    const duedate = new Date(2018, 6, 24, 0, 0, 0); // monthは0起点
	    const thisYearBd = new Date(today.getFullYear(), bd.getMonth(), bd.getDate());
	    age = today.getFullYear() - bd.getFullYear() - (today < thisYearBd ? 1 : 0);

	    // insert "kyougireki" options
	    hText = '<option data-placeholder="true" value="-1">年</option>';
	    for (i = 0; i <= age; i++) {
		hText += '<option value="' + i + '">' + i + '年</option>';
	    }
	    $('#career_year').html(hText);
	    $('#career_year').selectmenu('refresh');
	    
	    editable = true;
	    
	    if ($('#docid').val() != "") {
		// set form values
		for (i in response.data[es_sheet1]) {
		    data = response.data[es_sheet1][i];
		}
		s1data = data;

		const regdate = new Date(data.date);
		editable = today.getTime() < duedate.getTime();
		// editable = (regdate.getFullYear() == today.getFullYear() &&
		// 	    regdate.getMonth() == today.getMonth() &&
		// 	    regdate.getDate() == today.getDate());

		// p1
		$('input[name="date"]').val(data.date);
		// $('input[name="club"]').val(data.club);
		// $('input[name="gender"]').val([data.gender]);
		// $('select[name="birth_year"]').val(data.birth_year);
		// $('select[name="birth_month"]').val(data.birth_month);
		// $('select[name="birth_day"]').val(data.birth_day);
		// $('select[name="pref"]').val(data.pref);
		// $('select[name="category_s"]').val(data.category_s);
		// $('select[name="category_d"]').val(data.category_d);
		$('select[name="career_year"]').val(data.career_year);
		$('select[name="career_month"]').val(data.career_month);
		$('input[name="height"]').val(data.height);
		$('input[name="weight"]').val(data.weight);
		$('select[name="racket"]').val(data.racket);
		$('select[name="strings"]').val(data.strings);
		$('input[name="strings_tension"]').val(data.strings_tension);
		$('input[name="hand"]').val([data.hand]);
		$('input[name="forehand"]').val([data.forehand]);
		$('input[name="forehand_ob"]').val([data.forehand_ob]);
		$('input[name="backhand_ob"]').val([data.backhand_ob]);

		// p2
		if (data.medhist != null && Object.keys(data.medhist).length > 0) {
		    $.each(data.medhist, function(i,v) {
			const cnt = medhist_add_item();
			$('select[name="medhist['+cnt+'][kind]"]').val(v.kind);
			if (v.kind == 10) { // 手術
			    $('input[name="medhist['+cnt+'][disname]"]').val(v.disname);
			    $('input[name="medhist['+cnt+'][hospname]"]').val(v.hospname);
			} else if (v.kind == 11) { // その他
			    $('input[name="medhist['+cnt+'][disname]"]').val(v.disname);
			}
			$('select[name="medhist['+cnt+'][age]"]').val(v.age);
			$('select[name="medhist['+cnt+'][period_year]"]').val(v.period_year);
			$('select[name="medhist['+cnt+'][period_month]"]').val(v.period_month);
		    });
		} else {
		    medhist_add_item();
		    $('select[name="medhist[1][kind]"]').val(0);
		}

		for (i = 1; i <= 3; i++) {
		    $('select[name="allergy['+i+'][yn]"]').val(data.allergy[i].yn);
		    $('input[name="allergy['+i+'][subject]"]').val(data.allergy[i].subject);
		}

		// p3
		if (data.pain != null && Object.keys(data.pain).length > 0) {
		    $.each(data.pain, function(i,v) {
			const cnt = pain_add_item();
			$('select[name="pain['+cnt+'][kind]"]').val(v.kind);
			if (v.kind >= 16) {
			    $('input[name="pain['+cnt+'][part]"]').val(v.part);
			}
			$('input[name="pain['+cnt+'][age_from]"]').val(v.age_from);
			$('input[name="pain['+cnt+'][age_to]"]').val(v.age_to);
		    });
		} else {
		    pain_add_item();
		    $('select[name="pain[1][kind]"]').val(0);
		}

		// p4
		$('select[name="inquiry[1][yn]"]').val(data.inquiry[1].yn);
		$('input[name="inquiry[1][disname]"]').val(data.inquiry[1].disname);
		$('select[name="inquiry[2][yn]"]').val(data.inquiry[2].yn);
		$('input[name="inquiry[2][medname]"]').val(data.inquiry[2].medname);
		$('select[name="inquiry[3][age]"]').val(data.inquiry[3].age);
		$('select[name="inquiry[4][yn]"]').val(data.inquiry[4].yn);
		$('input[name="inquiry[4][inspection]"]').val(data.inquiry[4].inspection);
		$('textarea[name="inquiry[5][others]"]').val(data.inquiry[5].others);

		// disable fields if registration date is not today
		if (!editable) {
//		if (true) {
		    $('#sheet1_form input, #sheet1_form select, #sheet1_form textarea').attr('disabled', 'disabled');
		    $('#mad').hide();
		    $('#pad').hide();
		    $('#sheet1_submit').hide();
		    $('#sheet1_p1 select').selectmenu('disable');
		    $('#sheet1_p1 input[type="checkbox"]').checkboxradio('disable');
		    $('#sheet1_p1 input[type="radio"]').checkboxradio('disable');
		    $('#sheet1_p1 input[data-type="range"]').slider('disable');
		}

		// refresh p1
		$('#sheet1_p1 select').selectmenu('refresh');
		$('#sheet1_p1 input[type="checkbox"]').checkboxradio('refresh');
		$('#sheet1_p1 input[type="radio"]').checkboxradio('refresh');
		$('#sheet1_p1 input[data-type="range"]').slider('refresh');
		
	    } else {
		medhist_add_item();
		pain_add_item();
	    }
	    $.mobile.loading('hide');
	})
	.fail(function() {
	    console.log('fail');
	    $.mobile.loading('hide');
	    return false;
	});

    // $('div[data-role="page"]').on('swiperight', function() {
    // 	var pg = $(this).attr('id');
    // 	if (pg == 'sheet1_p2') {
    // 	    $('#sheet1_form').pagecontainer('change', '#sheet1_p1', {transition: 'slide', reverse: 'true'});
    // 	} else if (pg == 'sheet1_p3') {
    // 	    $('#sheet1_form').pagecontainer('change', '#sheet1_p2', {transition: 'slide', reverse: 'true'});
    // 	} else if (pg == 'sheet1_p4') {
    // 	    $('#sheet1_form').pagecontainer('change', '#sheet1_p3', {transition: 'slide', reverse: 'true'});
    // 	}
    // 	return false;
    // });

    // $('div[data-role="page"]').on('swipeleft', function() {
    // 	var pg = $(this).attr('id');
    // 	if (pg == 'sheet1_p1') {
    // 	    $('#sheet1_form').pagecontainer('change', '#sheet1_p2', {transition: 'slide'});
    // 	} else if (pg == 'sheet1_p2') {
    // 	    $('#sheet1_form').pagecontainer('change', '#sheet1_p3', {transition: 'slide'});
    // 	} else if (pg == 'sheet1_p3') {
    // 	    $('#sheet1_form').pagecontainer('change', '#sheet1_p4', {transition: 'slide'});
    // 	}
    // 	return false;
    // });
    
    $('#sheet1_form').on('change', 'select.s1medhist', function() {
	const c = $(this).attr('index');
	const kind = $(this).val();
	if (kind == 10) {
	    $('label[for="medhist['+c+'][disname]"]').show();
	    $('input[name="medhist['+c+'][disname]"]').parent('div').show();
	    $('label[for="medhist['+c+'][hospname]"]').show();
	    $('input[name="medhist['+c+'][hospname]"]').parent('div').show();
	    $('input[name="medhist['+c+'][disname]"]').focus();
	} else if (kind == 11) {
	    $('label[for="medhist['+c+'][disname]"]').show();
	    $('input[name="medhist['+c+'][disname]"]').parent('div').show();
	    $('label[for="medhist['+c+'][hospname]"]').hide();
	    $('input[name="medhist['+c+'][hospname]"]').parent('div').hide();
	} else {
	    $('label[for="medhist['+c+'][disname]"]').hide();
	    $('input[name="medhist['+c+'][disname]"]').parent('div').hide();
	    $('label[for="medhist['+c+'][hospname]"]').hide();
	    $('input[name="medhist['+c+'][hospname]"]').parent('div').hide();
	}
    });

    $('#sheet1_form').on('change', 'select.s1pain', function() {
	const c = $(this).attr('index');
	const kind = $(this).val();
	if (kind >= 16) {
	    $('label[for="pain['+c+'][part]"]').show();
	    $('input[name="pain['+c+'][part]"]').parent('div').show();
	    $('input[name="pain['+c+'][part]"]').focus();
	} else {
	    $('label[for="pain['+c+'][part]"]').hide();
	    $('input[name="pain['+c+'][part]"]').parent('div').hide();
	}
    });


    $('#sheet1_form').on('click', '#medhist_del', function() {
	$('.medhist').last().remove();
	return false;
    });
    
    $('#sheet1_form').on('click', '#medhist_add', function() {
	const cnt = medhist_add_item();
	$('label[for="medhist['+cnt+'][kind]"]').parent('div').enhanceWithin();
	$('label[for="medhist['+cnt+'][disname]"]').hide();
	$('input[name="medhist['+cnt+'][disname]"]').parent('div').hide();
	$('label[for="medhist['+cnt+'][hospname]"]').hide();
	$('input[name="medhist['+cnt+'][hospname]"]').parent('div').hide();
	return false;
    });

    $('#sheet1_form').on('click', '#pain_del', function(ev) {
	$('.pain').last().remove();
	return false;
    });
    
    $('#sheet1_form').on('click', '#pain_add', function(ev) {
	const cnt = pain_add_item();
	$('label[for="pain['+cnt+'][kind]"]').parent('div').enhanceWithin();
	$('label[for="pain['+cnt+'][part]"]').hide();
	$('input[name="pain['+cnt+'][part]"]').parent('div').hide();
	return false;
    });
    
    $('#sheet1_form').on('change slidestop', 'input.s1agerange', function() {
	const c = $(this).attr('index');
	const v_from = $('input[name="pain['+c+'][age_from]"]').val();
	const v_to = $('input[name="pain['+c+'][age_to]"]').val();
	if (v_to < age+1) {
	    $('div[name="pain['+c+'][agestr]"]').text(v_from+'歳 〜 '+v_to+'歳');
	} else {
	    $('div[name="pain['+c+'][agestr]"]').text(v_from+'歳 〜 現在');
	}
	return false;
    });

    $('#sheet1_form').on('change', 'select.s1allergy', function() {
	const c = $(this).attr('index');
	if ($(this).val() == 0) {
	    $('input[name="allergy['+c+'][subject]"]').parent('div').hide();
	} else {
	    $('input[name="allergy['+c+'][subject]"]').parent('div').show();
	    $('input[name="allergy['+c+'][subject]"]').focus();
	}
	return false;
    });

    $('#sheet1_form').on('change', 'select[name="inquiry[1][yn]"]', function() {
	if ($(this).val() == 0) {
	    $('label[for="inquiry[1][disname]"]').hide();
	    $('input[name="inquiry[1][disname]"]').parent('div').hide();
	} else {
	    $('label[for="inquiry[1][disname]"]').show();
	    $('input[name="inquiry[1][disname]"]').parent('div').show();
	    $('input[name="inquiry[1][disname]"]').focus();
	}
	return false;
    });

    $('#sheet1_form').on('change', 'select[name="inquiry[2][yn]"]', function() {
	if ($(this).val() == 0) {
	    $('label[for="inquiry[2][medname]"]').hide();
	    $('input[name="inquiry[2][medname]"]').parent('div').hide();
	} else {
	    $('label[for="inquiry[2][medname]"]').show();
	    $('input[name="inquiry[2][medname]"]').parent('div').show();
	    $('input[name="inquiry[2][medname]"]').focus();
	}
	return false;
    });

    $('#sheet1_form').on('change', 'select[name="inquiry[4][yn]"]', function() {
	if ($(this).val() == 0) {
	    $('label[for="inquiry[4][inspection]"]').hide();
	    $('input[name="inquiry[4][inspection]"]').parent('div').hide();
	} else {
	    $('label[for="inquiry[4][inspection]"]').show();
	    $('input[name="inquiry[4][inspection]"]').parent('div').show();
	    $('input[name="inquiry[4][inspection]"]').focus();
	}
	return false;
    });


    $('#sheet1_form').on('change', 'select.error,input[type="radio"].error', function() {
	$('#sheet1_form').valid();
    });
    $('#sheet1_form').on('change', 'select.s1medhist_period_month', function() {
	const index = $(this).attr('index');
	const period_year = $('select[name="medhist['+index+'][period_year]"]');
	if (period_year.hasClass('error')) {
	    $('#sheet1_form').valid();
	}
    });

    $('#sheet1_submit').on('click', function(ev) {
	const form = $('#sheet1_form');
	$('#sheet1_submit').addClass('ui-disabled');
	if (!form.valid()) {
	    console.log('invalid');
	    const firstError = form.find(':input.error:first');
	    const idErrorPage = firstError.parents('div:jqmData(role="page")').attr('id');
	    form.pagecontainer('change', '#'+idErrorPage);
	    $('#sheet1_submit').removeClass('ui-disabled');
	    return false;
	}
	$.mobile.loading('show');

	//if age_to is greater than his/her age, set to 999
	$.each($('input.s1agerangeto'), function() {
	    if ($(this).val() == age+1) {
		$(this).val(999);
	    }
	});
	$.ajax({
    	    url: 'ajax/put_sheet1.php',
    	    type: 'POST',
    	    dataType: 'json',
    	    data: form.serialize(),
    	    timeout: 10000
	})
    	    .done(function(response) {
    		$.mobile.loading('hide');
    		console.log('OK');
    		location.href = 'menu.php';
		return false;
    	    })
    	    .fail(function(jqxhr,status,error) {
    		$.mobile.loading('hide');
    		console.log('fail');
    		return false;
    	    });
	return false;
    });

    
    const validator = $('#sheet1_form').validate({
    	rules: {
	    career_year: {
		min: 0
	    },
	    career_month: {
		min: 0
	    },
	    racket: {
		min: 0
	    },
	    strings: {
		min: 0
	    },
	    hand: {
		required: true
	    },
	    forehand: {
		required: true
	    },
	    forehand_ob: {
		required: true
	    },
	    backhand_ob: {
		required: true
	    },
	    'inquiry[1][disname]': {
		required: function(){ return $('select[name="inquiry[1][yn]"]').val() == 1; },
		normalizer: function(val){ return $.trim(val); }
	    },
	    'inquiry[2][medname]': {
		required: function(){ return $('select[name="inquiry[2][yn]"]').val() == 1; },
		normalizer: function(val){ return $.trim(val); }
	    },
	    'inquiry[4][inspection]': {
		required: function(){ return $('select[name="inquiry[4][yn]"]').val() == 1; },
		normalizer: function(val){ return $.trim(val); }
	    }
    	},
	groups: {
	    birth_ymd: "birth_year birth_month birth_day",
	    career_ym: "career_year career_month"
	},
    	messages: {
	    career_year: {
		min: 'テニス競技歴を入力してください。'
	    },
	    career_month: {
		min: 'テニス競技歴を入力してください。'
	    },
	    racket: {
		min: 'ラケットの種類を選択してください。'
	    },
	    strings: {
		min: 'ストリングスの種類を選択してください。'
	    },
	    hand: {
		required: '利き手を選択してください。'
	    },
	    forehand: {
		required: 'フォアハンドを選択してください。'
	    },
	    forehand_ob: {
		required: 'フォアハンド（片手・両手）を選択してください。'
	    },
	    backhand_ob: {
		required: 'バックハンド（片手・両手）を選択してください。'
	    },
	    'inquiry[1][disname]': {
		required: '病名を入力してください。'
	    },
	    'inquiry[2][medname]': {
		required: '薬の名前を入力してください。'
	    },
	    'inquiry[4][inspection]': {
		required: '検査内容を入力してください。'
	    }
    	},
	errorPlacement: function(error, element) {
	    if (element.attr('name').match(/birth_year|birth_month|birth_day|career_year|career_month|period_year|period_month/) || element.attr('type') == 'radio') {
		error.insertAfter(element.parents('fieldset'));
	    } else {
		error.insertAfter(element.parent());
	    }
	}
    });
    
    $.validator.addMethod('medhist_check0', $.validator.methods.required,
			  '病名を選択してください。（ない場合は「なし」を選択）');
    $.validator.addMethod('medhist_check1', function(val, elem, params) {
	const c = elem.attributes['index'].value;
	const sel = $('select[name="medhist['+c+'][kind]"]').val();
	return (!($.trim(val) == '' && params.includes(sel)));
    }, '病名を入力してください。');
    $.validator.addMethod('medhist_check2', function(val, elem, params) {
	const c = elem.attributes['index'].value;
	const sel = $('select[name="medhist['+c+'][kind]"]').val();
	return (!($.trim(val) == '' && params.includes(sel)));
    }, '医療機関名を入力してください。');
    $.validator.addMethod('medhist_check3', function(val, elem, params) {
	const c = elem.attributes['index'].value;
	const sel = $('select[name="medhist['+c+'][kind]"]').val();
	return (sel === '0' || val != '');
    }, '発症年齢を選択してください。');
    $.validator.addMethod('medhist_check4', function(val, elem, param) {
	const c = elem.attributes['index'].value;
	const sel = $('select[name="medhist['+c+'][kind]"]').val();
	return (sel === '0' || val != '' && $('select[name="medhist['+c+'][period_month]"]').val() != '');
    }, '罹患期間を選択してください。');
    $.validator.addMethod('allergy_check', function(val, elem, params) {
	const c = elem.attributes['index'].value;
	const sel = $('select[name="allergy['+c+'][yn]"]').val();
	return (sel === '0' || $.trim(val) != '');
    }, '対象を入力してください。');
    $.validator.addMethod('pain_check0', $.validator.methods.required,
			  '部位を選択してください。（ない場合は「なし」を選択）');
    $.validator.addMethod('pain_check1', function(val, elem, param) {
	const c = elem.attributes['index'].value;
	const sel = $('select[name="pain['+c+'][kind]"]').val();
	return (sel <= 16 || $.trim(val) != '');
    }, '部位を入力してください。');
    
    $.validator.addClassRules(
    	's1medhist',
    	{
    	    medhist_check0: true
    	}
    );
    $.validator.addClassRules(
	's1medhist_disname',
	{
	    medhist_check1: ['10','11']
	}
    );
    $.validator.addClassRules(
	's1medhist_hospname',
	{
	    medhist_check2: ['10']
	}
    );
    $.validator.addClassRules(
	's1medhist_age',
	{
	    medhist_check3: true
	}
    );
    $.validator.addClassRules(
	's1medhist_period_year',
	{
	    medhist_check4: true
	}
    );
    $.validator.addClassRules(
	's1allergy_subject',
	{
	    allergy_check: true
	}
    );
    $.validator.addClassRules(
    	's1pain',
    	{
    	    pain_check0: true
    	}
    );
    $.validator.addClassRules(
	's1pain_part',
	{
	    pain_check1: true
	}
    );
    validator.settings.ignore = '';
//    validator.settings.focusInvalid = false;

    // $(document).on('pagecontainerbeforechange', function(){
    // 	console.log('change!');
    // 	if (!$('#sheet1_form').valid()) {
    // 	    return false;
    // 	}
    // });

    

});

$(document).on('pagecreate','#sheet1_p2',function(){
    var i;
    console.log('pagecreate: sheet1_p2');
    $('.medhist select').selectmenu('refresh');

    $.each($('.medhist'), function(i,v) {
	const cnt = $(this).attr('index');
	const kind = $('select[name="medhist['+cnt+'][kind]"]').val();
	if (kind == 10) { // 手術
	    $('label[for="medhist['+cnt+'][disname]"]').show();
	    $('input[name="medhist['+cnt+'][disname]"]').parent('div').show();
	    $('label[for="medhist['+cnt+'][hospname]"]').show();
	    $('input[name="medhist['+cnt+'][hospname]"]').parent('div').show();
	} else if (kind == 11) { // その他
	    $('label[for="medhist['+cnt+'][disname]"]').show();
	    $('input[name="medhist['+cnt+'][disname]"]').parent('div').show();
	    $('label[for="medhist['+cnt+'][hospname]"]').hide();
	    $('input[name="medhist['+cnt+'][hospname]"]').parent('div').hide();
	} else {
	    $('label[for="medhist['+cnt+'][disname]"]').hide();
	    $('input[name="medhist['+cnt+'][disname]"]').parent('div').hide();
	    $('label[for="medhist['+cnt+'][hospname]"]').hide();
	    $('input[name="medhist['+cnt+'][hospname]"]').parent('div').hide();
	}
    });
    $('#sheet1_p2 select').selectmenu('refresh');

    for (i = 1; i <= 3; i++) {
	if ($('select[name="allergy['+i+'][yn]"]').val() == 0) {
	    $('input[name="allergy['+i+'][subject]"]').parent('div').hide();
	} else {
	    $('input[name="allergy['+i+'][subject]"]').parent('div').show();
	}
    }
    
});

$(document).on('pagecreate', '#sheet1_p3', function() {
    console.log('pagecreate: sheet1_p3');
    $('#sheet1_p3 select').selectmenu('refresh');

    $.each($('select.s1pain'),function(i,v){
	const cnt = $(this).attr('index');
	const kind = $('select[name="pain['+cnt+'][kind]"]').val();
	if (kind >= 16) {
	    $('label[for="pain['+cnt+'][part]"]').show();
	    $('input[name="pain['+cnt+'][part]"]').parent('div').show();
	} else {
	    $('label[for="pain['+cnt+'][part]"]').hide();
	    $('input[name="pain['+cnt+'][part]"]').parent('div').hide();
	}
    });


    if (s1data != null && s1data.pain != null) {
    	$.each(s1data.pain, function(i,v) {
    	    const cnt = i+1;
    	    $('input[name="pain['+cnt+'][age_from]"]').val(v.age_from);
    	    $('input[name="pain['+cnt+'][age_to]"]').val(v.age_to);
    	    if (v.age_to < age+1) {
    		$('div[name="pain['+cnt+'][agestr]"]').text(v.age_from+'歳 〜 '+v.age_to+'歳');
    	    } else {
    		$('div[name="pain['+cnt+'][agestr]"]').text(v.age_from+'歳 〜 現在');
    	    }
    	});
    }

    $('div[data-role="rangeslider"]').rangeslider('refresh');

});


$(document).on('pagecreate', '#sheet1_p4', function() {
    console.log('pagecreate: sheet1_p4');
    $('#sheet1_p4 select').selectmenu('refresh');

    // enable/disable
    if ($('select[name="inquiry[1][yn]"]').val() == 0) {
	$('label[for="inquiry[1][disname]"]').hide();
	$('input[name="inquiry[1][disname]"]').parent('div').hide();
    } else {
	$('label[for="inquiry[1][disname]"]').show();
	$('input[name="inquiry[1][disname]"]').parent('div').show();
    }

    if ($('select[name="inquiry[2][yn]"]').val() == 0) {
	$('label[for="inquiry[2][medname]"]').hide();
	$('input[name="inquiry[2][medname]"]').parent('div').hide();
    } else {
	$('label[for="inquiry[2][medname]"]').show();
	$('input[name="inquiry[2][medname]"]').parent('div').show();
    }

    if ($('select[name="inquiry[4][yn]"]').val() == 0) {
	$('label[for="inquiry[4][inspection]"]').hide();
	$('input[name="inquiry[4][inspection]"]').parent('div').hide();
    } else {
	$('label[for="inquiry[4][inspection]"]').show();
	$('input[name="inquiry[4][inspection]"]').parent('div').show();
    }

});

// sheet2/index.php
function sheet2_p1_refresh() {
    $('#sheet2_p1 select').selectmenu('refresh');
    $('#sheet2_p1 input[type="checkbox"]').checkboxradio('refresh');
    $('#sheet2_p1 input[data-type="range"]').slider('refresh');
}

// sheet2
$(document).on('pagecreate', '#sheet2_p1', function() {
    console.log('pagecreate: sheet2_p1');

    editable = true;
    
    if ($('#docid').val() != "") {
	$.mobile.loading('show');
	$.ajax({
	    url: 'ajax/get_data_by_id.php',
	    type: 'POST',
	    dataType: 'json',
	    data: {
		index: es_sheet2,
		type: 'checksheet2',
		id: $('#docid').val()
	    },
	    timeout: 10000
	})
	    .done(function(response) {
		var i;
		const data=response.data;
		const today = new Date();
		const regdate = new Date(data.date);
		editable = (regdate.getFullYear() == today.getFullYear() &&
			    regdate.getMonth() == today.getMonth() &&
			    regdate.getDate() == today.getDate());

		// p1
		$('input[name="date"]').val(data.date);
		$('select[name="category_s"]').val(data.category_s);
		$('select[name="category_d"]').val(data.category_d);
		if (data.stat != null) {
		    $.each(data.stat, function(i, v) {
			$('input[name="stat['+i+']"]').val([v]);
		    });
		}
		
		$('input[name="sleep_usual"]').val(data.sleep_usual);
		$('input[name="sleep_yesterday"]').val(data.sleep_yesterday);

		// insert date in header
		const regmonth = parseInt(data.date.substr(5,2));
		const regday = parseInt(data.date.substr(8,2));
		$('div[data-role="header"]').append(
		    '<button class="ui-btn-right" type="button">'+regmonth+'月'+regday+'日分</button>').enhanceWithin();
		
		// p2
		for (i = 1; i <= 25; i++) {
		    $('input[name="pain_now[front]['+i+']"]').val(data.pain_now.front[i]);
		    $('input[name="pain_past[front]['+i+']"]').val(data.pain_past.front[i]);
		}
		for (i = 1; i <= 9; i++) {
		    $('input[name="pain_now[back]['+i+']"]').val(data.pain_now.back[i]);
		    $('input[name="pain_past[back]['+i+']"]').val(data.pain_past.back[i]);
		}
		$('input[name="check"]').val([data.check]);

		// disable fields if registration date is not today
		if (!editable) {
		    $('#sheet2_form input, #sheet2_form select, #sheet2_form textarea').attr('disabled', 'disabled');
		    $('#sheet2_submit').hide();
		    $('#sheet2_p1 select').selectmenu('disable');
		    $('#sheet2_p1 input[type="checkbox"]').checkboxradio('disable');
		    $('#sheet2_p1 input[data-type="range"]').slider('disable');

		}
		
		// refresh p1
		sheet2_p1_refresh();
		$.mobile.loading('hide');
	    })
	    .fail(function() {
		$.mobile.loading('hide');
		console.log('fail');
		return false;
	    });
    } else {
	// insert date in header
	const today = new Date();
	const regmonth = today.getMonth()+1;
	const regday = today.getDate();
	$('div[data-role="header"]').append(
	    '<button class="ui-btn-right" type="button">'+regmonth+'月'+regday+'日分</button>').enhanceWithin();
	// refresh
	sheet2_p1_refresh();
    }
    
    // $('#sheet2_p2').on('swiperight', function() {
    // 	$('#sheet2_form').pagecontainer('change', '#sheet2_p1', {transition: 'slide', reverse: 'true'});
    // 	return false;
    // });

    // $('#sheet2_p1').on('swipeleft', function() {
    // 	$('#sheet2_form').pagecontainer('change', '#sheet2_p2', {transition: 'slide'});
    // 	return false;
    // });

    $('#sheet2_submit').on('click', function() {
	const form = $('#sheet2_form');
	$('#sheet2_submit').addClass('ui-disabled');
    	if (!form.valid()) {
	    console.log('invalid');
	    const firstError = form.find(":input.error:first");
	    const idErrorPage = firstError.parents("div:jqmData(role='page')").attr("id");
	    form.pagecontainer('change', '#'+idErrorPage);
	    $('#sheet2_submit').removeClass('ui-disabled');
	    return false;
	}
	$.mobile.loading('show');
	$.ajax({
	    url: 'ajax/put_sheet2.php',
	    type: 'POST',
	    dataType: 'json',
	    data: form.serialize(),
	    timeout: 10000
	})
	    .done(function(response){
		$.mobile.loading('hide');
//		console.log(response);
		location.href = 'menu.php';
	    })
	    .fail(function(response){
		$.mobile.loading('hide');
		console.log('fail');
		return false;
	    });
	return false;
    });

    $('#sheet2_form').on('change', 'select.error,input.error', function() {
	$('#sheet2_form').valid();
    });

    const validator = $('#sheet2_form').validate({
	rules: {
	    category_s: {
		required: true
	    },
	    category_d: {
		required: true
	    },
	    check: {
		required: true
	    }
	},
	messages: {
	    category_s: {
		required: '出場カテゴリーを選択してください。'
	    },
	    category_d: {
		required: '出場カテゴリーを選択してください。'
	    },
	    check: {
		required: 'チェックしてください。'
	    }
	}
    });
    validator.settings.ignore = "";
	    
});
    
$(document).on('pagecreate', '#sheet2_p2', function() {
    console.log("pagecreate: sheet2_p2");

    $('input[name="check"]').checkboxradio('refresh');

    const c = ['#aaa','#ff0','#fc0','#f90','#f60','#f30'];
    $('.mark').each(function() {
	const f = $(this).attr('for');
	const fx = $("#"+f).val();
	var click;
	if (fx == 0) {
	    $(this).html('');
	} else {
	    $(this).html(fx);
	}
	$(this).css('background-color', c[fx]);

	if (editable) {
	    click = '';
	    if (typeof window.ontouchstart == 'undefined') {
		click = 'mousedown';
	    } else {
		click = 'tap';
	    }
	    
	    $(this).off(click);
	    $(this).on(click, function() {
		const f = $(this).attr('for');
		var fx = $("#"+f).val();
		fx++;
		if (fx > 5) {
		    fx = 0;
		    $(this).html('');
		} else {
		    $(this).html(fx);
		}
		$(this).css('background-color', c[fx]);
		$('#'+f).val(fx);
		
	    });
	}
    });

});
