var responsecache;
var playerdata;
var s1data;
var s1data_docid;
var s2data;
var age;
var reload = true;

var backpos = null;

function write_sheet1() {
    // calculate age
    const bd = new Date(playerdata.birthdate);
    const today = new Date();
    const thisYearBd = new Date(today.getFullYear(), bd.getMonth(), bd.getDate());
    age = today.getFullYear() - bd.getFullYear() - (today < thisYearBd ? 1 : 0);

    let hText =
	'<div id="staff_sheet1" data-role="page" class="dynamic_page staff_sheet1">'+
	'<div data-role="header" data-position="fixed" data-tap-toggle="false">';
    if (s1data === null) {
	hText +=
	    '<h1>大会前シート （未入力）</h1>';
    } else {
	hText +=
	    '<h1>大会前シート （'+h(s1data.date.substr(0,10))+'）</h1>';
    }
    hText +=
	'<a href="#staff_plist" data-role="button" data-theme="b" data-icon="back" data-transition="slide" data-direction="reverse">選手一覧に戻る</a>';
    hText +=
	'<form method="POST" action="treatment.php" data-ajax="false">'+
	'<input type="hidden" name="player_uid" value="'+playerdata.uid+'" />'+
	'<button class="ui-btn ui-btn-b ui-btn-right ui-corner-all">処置・診療記録</button>'+
	'</form>';
    hText +=
	'</div>'+
	'<div class="ui-content" role="main" id="staff_sheet1_main">';
    if (s1data !== null) {
	hText +=
	    '<div style="text-align: right;">入力日時: '+h(s1data.date);
	hText += '<button class="update_sheet1" docid="'+s1data_docid+'" data-theme="b" data-inline="true" data-mini="true">修正</button>';
	hText += '</div>';
    }
    hText +=
	'<table id="staff_sheet1_table" data-role="table" data-mode="none">'+
	'<tbody id="staff_sheet1_tbody">';
    hText +=
	'<tr><th>氏名／ふりがな</th><td>'+h(playerdata.name)+' ／ '+h(playerdata.name_kana)+'</td></tr>'+
	'<tr><th>所属</th><td>'+(playerdata.club ? h(playerdata.club) : '')+'</td></tr>'+
	'<tr><th>都道府県</th><td>'+prefs[playerdata.pref]+'</td></tr>'+
	'<tr><th>階級</th><td>'+categories[playerdata.category]+'</td></tr>'+
	'<tr><th>性別</th><td>'+genders[playerdata.gender]+'</td></tr>';
    if (s1data !== null) {
	hText +=
	    '<tr><th>競技歴</th><td>'+s1data.career_year+'年 '+s1data.career_month+'ヶ月</td></tr>'+
	    '<tr><th>身長／体重</th><td>'+s1data.height+' cm ／ '+s1data.weight+' kg</td></tr>'+
	    '<tr><th>ラケットの種類</th><td>'+rackets[s1data.racket]+'</td></tr>'+
	    '<tr><th>ストリング</th><td>'+strings[s1data.strings]+'・'+s1data.strings_tension+' ポンド</td></tr>'+
	    '<tr><th>利き手等</th>'+
	    '<td>利き手: '+(s1data.hand == 'r' ? '右手': (s1data.hand == 'l' ? '左手' : (s1data.hand == 'b' ? '両手' : '')))
	    + ' ／ フォアハンド: '+(s1data.forehand == 'r' ? '右手': (s1data.forehand == 'l' ? '左手' : ''))
	    + '・'+(s1data.forehand_ob == 'o' ? '片手' : (s1data.forehand_ob == 'b' ? '両手' : ''))
	    + ' ／ バックハンド: '+(s1data.backhand_ob == 'o' ? '片手': (s1data.backhand_ob == 'b' ? '両手' : ''))
	    + '</td></tr>';
	//    hText += '<tr><th></th><td></td></tr>';

	let arr = [];
	if (s1data.medhist != null && Object.keys(s1data.medhist).length > 0) {
	    $.each(s1data.medhist, function(i, v) {
		if (v.kind == 10 || v.kind == 11) {
		    arr.push(disnames[v.kind]+' ('+h(v.disname)+', '+ages[v.age]+', '+v.period_year+'年'+v.period_month+'ヶ月)');
		} else {
		    arr.push(disnames[v.kind]+' ('+ages[v.age]+', '+v.period_year+'年'+v.period_month+'ヶ月)');
		}
	    });
	    hText += '<tr class="highlight"><th>既往歴</th><td>'+arr.join('<br/>')+'</td></tr>';
	} else {
	    hText += '<tr><th>既往歴</th><td>なし</td></tr>';
	}
	
	let cnt = 0;
	arr = [];
	$.each(s1data.allergy, function(i, v) {
	    if (v.yn == 1) {
		hText += '<tr class="highlight"><th>'+allergynames[i]+'</th><td>あり（'+h(v.subject)+'）</td></tr>';
	    } else {
		hText += '<tr><th>'+allergynames[i]+'</th><td>なし</td></tr>';
	    }
	});

	arr = [];
	if (s1data.pain != null && Object.keys(s1data.pain).length > 0) {
	    $.each(s1data.pain, function(i, v) {
		if (v.kind >= 16) {
		    arr.push(bodyparts[v.kind]+' ('+h(v.part)+', '+v.age_from+'歳〜'+(v.age_to == 999 ? '現在)' : (v.age_to+'歳)')));
		} else {
		    arr.push(bodyparts[v.kind]+' ('+v.age_from+'歳〜'+(v.age_to == 999 ? '現在)' : (v.age_to+'歳)')));
		}
	    });
	    hText += '<tr class="highlight"><th>痛み・ケガ</th><td>'+arr.join('<br/>')+'</td></tr>';
	} else {
	    hText += '<tr><th>痛み・ケガ</th><td>なし</td></tr>';
	}
	
	if (s1data.inquiry[1].yn == 1) {
	    hText += '<tr><th>現在治療中の病気</th><td>'+h(s1data.inquiry[1].disname)+'</td></tr>';
	} else {
	    hText += '<tr><th>現在治療中の病気</th><td>なし</td></tr>';
	}
	if (s1data.inquiry[2].yn == 1) {
	    hText += '<tr><th>普段飲んでいる薬</th><td>'+h(s1data.inquiry[2].medname)+'</td></tr>';
	} else {
	    hText += '<tr><th>普段飲んでいる薬</th><td>なし</td></tr>';
	}
	if (s1data.inquiry[3].age != -1) {
	    hText += '<tr><th>意識を失った経験</th><td>'+s1data.inquiry[3].age+'歳</td></tr>';
	} else {
	    hText += '<tr><th>意識を失った経験</th><td>なし</td></tr>';
	}
	if (s1data.inquiry[4].yn == 1) {
	    hText += '<tr><th>健診・精密検査</th><td>'+h(s1data.inquiry[4].inspection)+'</td></tr>';
	} else {
	    hText += '<tr><th>健診・精密検査</th><td>なし</td></tr>';
	}
	if (s1data.inquiry[5].others != '') {
	    hText += '<tr><th>その他気になること等</th><td>'+h(s1data.inquiry[5].others)+'</td></tr>';
	} else {
	    hText += '<tr><th>その他気になること等</th><td>なし</td></tr>';
	}
    }
    hText +=
	'</tbody>'+
	'</table>'+
	'</div>'+
	'<div data-role="footer" data-position="fixed" data-tap-toggle="false">'+
	'<div class="ui-bar">'+
	'<a href="#staff_plist" data-role="button" data-theme="b" data-icon="back" data-transition="slide" data-direction="reverse">選手一覧に戻る</a>';
    if (Object.keys(s2data).length > 0) {
	hText +=
	    '<a href="#staff_sheet2_0" data-role="button" data-theme="b" data-icon="arrow-r" data-iconpos="right" data-transition="slide" style="float: right">試合当日シート'+h(s2data[Object.keys(s2data)[0]].date.substr(0,10))+'</a>';

    }
    hText +=
	'</div>'+
	'</div>'+
	'</div>';

    $('body').append(hText);
}

function write_sheet2(i) {
    const docid = Object.keys(s2data)[i];
    const today = new Date();
    hText =
	'<div id="staff_sheet2_'+i+'" data-role="page" class="dynamic_page staff_sheet2" index="'+i+'">'+
	'<div data-role="header" data-position="fixed" data-tap-toggle="false">'+
	'<h1>試合当日シート '+h(s2data[docid].date.substr(0,10))+'</h1>'+
	'<a href="#staff_plist" data-role="button" data-theme="b" data-transition="slide" data-icon="back" data-direction="reverse">選手一覧に戻る</a>'+
	'<form method="POST" action="treatment.php" data-ajax="false">'+
	'<input type="hidden" name="player_uid" value="'+playerdata.uid+'" />'+
	'<button data-theme="b" class="ui-btn-right">処置・診療記録</button>'+
	'</form>'+
	'</div>'+
	'<div class="ui-content" role="main">'+
	'<div style="text-align: right;">入力日時: '+h(s2data[docid].date)+'&nbsp;';
    if (s2data[docid].staff_checked != null) {
	hText +=
	    '<button class="s2uncheck" docid="'+docid+'" data-theme="a" data-inline="true" data-mini="true">　確認済み　</button>';
    } else {
	const idate = new Date(s2data[docid].date);
	if (idate.getFullYear() == today.getFullYear() &&
	    idate.getMonth() == today.getMonth() &&
	    idate.getDate() == today.getDate()) {
	    hText +=
		'<button class="s2check" docid="'+docid+'" data-theme="b" data-inline="true" data-mini="true">確認済みにする</button>';
	} else {
	    hText +=
		'<button data-theme="a" data-inline="true" data-mini="true">　未確認　</button>';
	}
    }
    
    hText += '<button  class="update_sheet2" docid="'+docid+'" index="'+i+'" data-theme="b" data-inline="true" data-mini="true">修正</button>';
    
    hText += '</div>';
    hText +=
	'<table id="staff_sheet2_table" data-role="table" data-mode="none">'+
	'<tbody id="staff_sheet2_tbody">'+
	'<tr><th>氏名／ふりがな</th><td>'+h(playerdata.name)+' ／ '+h(playerdata.name_kana)+'</td></tr>'+
	//	    '<tr><th>学校名</th><td>'+(playerdata.school ? h(playerdata.school) : '')+'</td></tr>'+
	'<tr><th>所属</th><td>'+(playerdata.club ? h(playerdata.club) : '')+'</td></tr>'+
	'<tr><th>都道府県</th><td>'+prefs[playerdata.pref]+'</td></tr>'+
	'<tr><th>出場カテゴリー</th><td>'
	+(s2data[docid].category_s != 'no' ? categories_s[s2data[docid].category_s] : '')
	+(s2data[docid].category_s != 'no' && s2data[docid].category_d != 'no' ? ' ／ ' : '')
	+(s2data[docid].category_d != 'no' ? categories_d[s2data[docid].category_d] : '') + '</td></tr>';
    if (s2data[docid].stat != null) {
	let stat = [];
	$.each(s2data[docid].stat, function(j,v) {
	    stat.push(statstrs[j]);
	});
	hText +=
	    '<tr class="highlight"><th>体調</th><td>'+stat.join('<br/>')+'</td></tr>';
    } else {
	hText +=
	    '<tr><th>体調</th><td>-</td></tr>';
    }
    hText += '</td></tr>';
    
    hText +=
	'<tr><th>睡眠時間</th><td>'+s2data[docid].sleep_yesterday+' 時間 （普段 '+s2data[docid].sleep_usual+' 時間）</td></tr>';

    hText +=
	'</tbody>'+
	'</table>';

    hText += 
	'<br/>'+
	'<div class="ui-bar ui-bar-a ui-corner-all">【現在】痛みがある部位</div>'+
	'<br/>'+
	'<div class="bodybody">'+
	'<div class="bodyimg">'+
	'<img src="img/fig3f.png" height="413" draggable="false"/>';
    const pos_front = [
	[0,79],
	[70,34],[110,31],[150,24],[187,16],[225,6],
	[70,122],[110,125],[150,132],[187,140],[225,150],
	[100,79],[150,79],
	[205,57],[243,57],[285,58],[325,58],[365,60],[395,53],
	[205,101],[243,101],[285,100],[325,100],[365,98],[395,105]
    ];
    const pos_back = [
	[0,82],
	[70,36],[70,125],
	[100,82],[170,82],
	[250,62],[310,62],
	[250,102],[310,102]
    ];

    $.each(pos_front, function(j, xy) {
	const x = xy[1];
	const y = xy[0];
	const val = s2data[docid].pain_now.front[j+1];
	hText +=
	    '<label class="mark mark'+val+'" for="part_pf'+(j+1)+'" style="top: '+y+'px;left: '+x+'px;">'+(val>0 ? val : '')+'</label>';
    });
    hText +=
	'</div>'+
	'<div class="bodyimg">'+
        '<img src="img/fig3b.png" height="413" draggable="false"/>';
    $.each(pos_back, function(j, xy) {
	const x = xy[1];
	const y = xy[0];
	const val = s2data[docid].pain_now.back[j+1];
	hText +=
	    '<label class="mark mark'+val+'" for="part_pb'+(j+1)+'" style="top: '+y+'px;left: '+x+'px;">'+(val>0 ? val : '')+'</label>';
    });
    hText +=
	'</div>'+
	'</div>';

    hText +=
	'<div class="ui-bar ui-bar-a ui-corner-all">【以前から】痛みがある部位</div>'+
	'<br/>'+
	'<div class="bodybody">'+
	'<div class="bodyimg">'+
	'<img src="img/fig3f.png" height="413" draggable="false"/>';
    $.each(pos_front, function(j, xy) {
	const x = xy[1];
	const y = xy[0];
	const val = s2data[docid].pain_past.front[j+1];
	hText +=
	    '<label class="mark mark'+val+'" for="part_qf'+(j+1)+'" style="top: '+y+'px;left: '+x+'px;">'+(val>0 ? val : '')+'</label>';
    });
    hText += 
	'</div>'+
	'<div class="bodyimg">'+
        '<img src="img/fig3b.png" height="413" draggable="false"/>';
    $.each(pos_back, function(j, xy) {
	const x = xy[1];
	const y = xy[0];
	const val = s2data[docid].pain_past.back[j+1];
	hText +=
	    '<label class="mark mark'+val+'" for="part_qb'+(j+1)+'" style="top: '+y+'px;left: '+x+'px;">'+(val>0 ? val : '')+'</label>';
    });
    hText +=
        '</div>'+
	'</div>'+
	'</div>';
    hText +=
	'<div data-role="footer" data-position="fixed" data-tap-toggle="false">'+
	'<div class="ui-bar">';
    if (i > 0) {
	hText += 
	    '<a href="#staff_sheet2_'+(i-1)+'" data-role="button" data-theme="b" data-icon="arrow-l" data-transition="slide" data-direction="reverse">試合当日シート'+s2data[Object.keys(s2data)[i-1]].date.substr(0,10)+'</a>';
    } else {
	hText +=
	    '<a href="#staff_sheet1" data-role="button" data-theme="b" data-icon="arrow-l" data-transition="slide" data-direction="reverse">大会前シート</a>';
    }
    if (i < Object.keys(s2data).length-1) {
	hText +=
	    '<a href="#staff_sheet2_'+(i+1)+'" data-role="button" data-theme="b" data-icon="arrow-r" data-iconpos="right" data-transition="slide" style="float: right">試合当日シート'+s2data[Object.keys(s2data)[i+1]].date.substr(0,10)+'</a>';
    }
    hText +=
	'</div>'+
	'</div>'+
	'</div>';

    $('body').append(hText);

}

    
function go(index) {
    playerdata = responsecache.data[index][es_players][Object.keys(responsecache.data[index][es_players])[0]];
    if (responsecache.data[index][es_sheet1] != null) {
	s1data_docid = Object.keys(responsecache.data[index][es_sheet1])[0];
	s1data = responsecache.data[index][es_sheet1][s1data_docid];
    } else {
	s1data = null;
    }
    if (responsecache.data[index][es_sheet2] != null) {
	s2data = responsecache.data[index][es_sheet2];
    } else {
	s2data = [];
    }

    // remove dynamic pages
    $('.dynamic_page').remove();
    
    // generate sheet1 page
    write_sheet1();
    
    // generate sheet2 page(s)
    for (let i = 0; i < Object.keys(s2data).length; i++) {
	write_sheet2(i);
    }
    
    $('body').pagecontainer('change', '#staff_sheet1', { transition: 'slide' });
}

//if (Object.values(s2data).length > 0) {
$(document).on('swipeleft', 'div.staff_sheet1', function() {
    $('body').pagecontainer('change', '#staff_sheet2_0', { transition: 'slide' });
    return false;
});

$(document).on('swiperight', 'div.staff_sheet1', function() {
    $('body').pagecontainer('change', '#staff_plist', { transition: 'slide', reverse: true });
    return false;
});

$(document).on('swiperight', 'div.staff_sheet2', function() {
    const index = $(this).attr('index');
    if (index == 0) {
	$('body').pagecontainer('change', '#staff_sheet1', { transition: 'slide', reverse: true });
    } else {
	$('body').pagecontainer('change', '#staff_sheet2_'+(index-1), { transition: 'slide', reverse: true });
    }
});

$(document).on('swipeleft', 'div.staff_sheet2', function() {
    const index = parseInt($(this).attr('index'));
    $('body').pagecontainer('change', '#staff_sheet2_'+(index+1), { transition: 'slide' });
});

// sheet1
$(document).on('click', 'button.update_sheet1', function() {
    const docid = $(this).attr('docid');

    $('#sheet1_form input[name="docid"]').val(docid);
    $('#sheet1_form input[name="uid"]').val(playerdata.uid);

    $('body').pagecontainer('change', '#sheet1_p1', { transition : 'slide' });
});

$(document).on('pagecreate', '#sheet1_p1', function() {
    console.log('pagecreate: sheet1_p1');

    const docid = s1data_docid;
    const data = s1data;

    // calculate age
    const bd = new Date(playerdata.birthdate);
    const today = new Date();
    const thisYearBd = new Date(today.getFullYear(), bd.getMonth(), bd.getDate());
    const age = today.getFullYear() - bd.getFullYear() - (today < thisYearBd ? 1 : 0);

    // insert "kyougireki" options
    let hText = '<option data-placeholder="true" value="-1">年</option>';
    for (let i = 0; i <= age; i++) {
	hText += '<option value="' + i + '">' + i + '年</option>';
    }
    $('#sheet1_form select[name="career_year"]').html(hText);
    
    $('#sheet1_form input[name="date"]').val(data.date);
    $('#sheet1_form select[name="career_year"]').val(data.career_year);
    $('#sheet1_form select[name="career_month"]').val(data.career_month);
    $('#sheet1_form input[name="height"]').val(data.height);
    $('#sheet1_form input[name="weight"]').val(data.weight);
    $('#sheet1_form select[name="racket"]').val(data.racket);
    $('#sheet1_form select[name="strings"]').val(data.strings);
    $('#sheet1_form input[name="strings_tension"]').val(data.strings_tension);
    $('#sheet1_form input[name="hand"]').val([data.hand]);
    $('#sheet1_form input[name="forehand"]').val([data.forehand]);
    $('#sheet1_form input[name="forehand_ob"]').val([data.forehand_ob]);
    $('#sheet1_form input[name="backhand_ob"]').val([data.backhand_ob]);

    if (data.medhist != null && Object.keys(data.medhist).length > 0) {
    	$.each(data.medhist, function(i,v) {
    	    const cnt = medhist_add_item();
    	    $('#sheet1_form select[name="medhist['+cnt+'][kind]"]').val(v.kind);
    	    if (v.kind == 10) { // 手術
    		$('#sheet1_form input[name="medhist['+cnt+'][disname]"]').val(v.disname);
    		$('#sheet1_form input[name="medhist['+cnt+'][hospname]"]').val(v.hospname);
    	    } else if (v.kind == 11) { // その他
    		$('#sheet1_form input[name="medhist['+cnt+'][disname]"]').val(v.disname);
    	    }
    	    $('#sheet1_form select[name="medhist['+cnt+'][age]"]').val(v.age);
    	    $('#sheet1_form select[name="medhist['+cnt+'][period_year]"]').val(v.period_year);
    	    $('#sheet1_form select[name="medhist['+cnt+'][period_month]"]').val(v.period_month);
    	});
    // } else {
    // 	medhist_add_item();
    // 	$('#sheet1_form select[name="medhist[1][kind]"]').val(0);
    }
    $('.medhist').enhanceWithin();
    
    for (let i = 1; i <= 3; i++) {
    	$('#sheet1_form select[name="allergy['+i+'][yn]"]').val(data.allergy[i].yn);
    	$('#sheet1_form input[name="allergy['+i+'][subject]"]').val(data.allergy[i].subject);
    }

    // p3
    if (data.pain != null && Object.keys(data.pain).length > 0) {
    	$.each(data.pain, function(i,v) {
    	    const cnt = pain_add_item();
    	    $('.pain').enhanceWithin();
    	    $('#sheet1_form select[name="pain['+cnt+'][kind]"]').val(v.kind);
    	    if (v.kind >= 16) {
    		$('#sheet1_form input[name="pain['+cnt+'][part]"]').val(v.part);
    	    }
    	    $('input[name="pain['+cnt+'][age_from]"]').val(v.age_from);
    	    $('input[name="pain['+cnt+'][age_to]"]').val(v.age_to);
    	    if (v.age_to < age+1) {
    		$('div[name="pain['+cnt+'][agestr]"]').text(v.age_from+'歳 〜 '+v.age_to+'歳');
    	    } else {
    		$('div[name="pain['+cnt+'][agestr]"]').text(v.age_from+'歳 〜 現在');
    	    }
    	});
    // } else {
    // 	pain_add_item();
    // 	$('#sheet1_form select[name="pain[1][kind]"]').val(0);
    }


    // p4
    $('#sheet1_form select[name="inquiry[1][yn]"]').val(data.inquiry[1].yn);
    $('#sheet1_form input[name="inquiry[1][disname]"]').val(data.inquiry[1].disname);
    $('#sheet1_form select[name="inquiry[2][yn]"]').val(data.inquiry[2].yn);
    $('#sheet1_form input[name="inquiry[2][medname]"]').val(data.inquiry[2].medname);
    $('#sheet1_form select[name="inquiry[3][age]"]').val(data.inquiry[3].age);
    $('#sheet1_form select[name="inquiry[4][yn]"]').val(data.inquiry[4].yn);
    $('#sheet1_form input[name="inquiry[4][inspection]"]').val(data.inquiry[4].inspection);
    $('#sheet1_form textarea[name="inquiry[5][others]"]').val(data.inquiry[5].others);

    $.each($('#sheet1_form .medhist'), function(i,v) {
	const cnt = $(this).attr('index');
	const kind = $('#sheet1_form select[name="medhist['+cnt+'][kind]"]').val();
	if (kind == 10) { // 手術
	    $('#sheet1_form label[for="medhist['+cnt+'][disname]"]').show();
	    $('#sheet1_form input[name="medhist['+cnt+'][disname]"]').parent('div').show();
	    $('#sheet1_form label[for="medhist['+cnt+'][hospname]"]').show();
	    $('#sheet1_form input[name="medhist['+cnt+'][hospname]"]').parent('div').show();
	} else if (kind == 11) { // その他
	    $('#sheet1_form label[for="medhist['+cnt+'][disname]"]').show();
	    $('#sheet1_form input[name="medhist['+cnt+'][disname]"]').parent('div').show();
	    $('#sheet1_form label[for="medhist['+cnt+'][hospname]"]').hide();
	    $('#sheet1_form input[name="medhist['+cnt+'][hospname]"]').parent('div').hide();
	} else {
	    $('#sheet1_form label[for="medhist['+cnt+'][disname]"]').hide();
	    $('#sheet1_form input[name="medhist['+cnt+'][disname]"]').parent('div').hide();
	    $('#sheet1_form label[for="medhist['+cnt+'][hospname]"]').hide();
	    $('#sheet1_form input[name="medhist['+cnt+'][hospname]"]').parent('div').hide();
	}
    });

    for (let i = 1; i <= 3; i++) {
	if ($('#sheet1_form select[name="allergy['+i+'][yn]"]').val() == 0) {
	    $('#sheet1_form input[name="allergy['+i+'][subject]"]').parent('div').hide();
	} else {
	    $('#sheet1_form input[name="allergy['+i+'][subject]"]').parent('div').show();
	}
    }

    $.each($('#sheet1_form select.s1pain'),function(i,v){
	const cnt = $(this).attr('index');
	const kind = $('#sheet1_form select[name="pain['+cnt+'][kind]"]').val();
	if (kind >= 16) {
	    $('#sheet1_form label[for="pain['+cnt+'][part]"]').show();
	    $('#sheet1_form input[name="pain['+cnt+'][part]"]').parent('div').show();
	} else {
	    $('#sheet1_form label[for="pain['+cnt+'][part]"]').hide();
	    $('#sheet1_form input[name="pain['+cnt+'][part]"]').parent('div').hide();
	}
    });

    if ($('#sheet1_form select[name="inquiry[1][yn]"]').val() == 0) {
	$('#sheet1_form label[for="inquiry[1][disname]"]').hide();
	$('#sheet1_form input[name="inquiry[1][disname]"]').parent('div').hide();
    } else {
	$('#sheet1_form label[for="inquiry[1][disname]"]').show();
	$('#sheet1_form input[name="inquiry[1][disname]"]').parent('div').show();
    }

    if ($('#sheet1_form select[name="inquiry[2][yn]"]').val() == 0) {
	$('#sheet1_form label[for="inquiry[2][medname]"]').hide();
	$('#sheet1_form input[name="inquiry[2][medname]"]').parent('div').hide();
    } else {
	$('#sheet1_form label[for="inquiry[2][medname]"]').show();
	$('#sheet1_form input[name="inquiry[2][medname]"]').parent('div').show();
    }

    if ($('#sheet1_form select[name="inquiry[4][yn]"]').val() == 0) {
	$('#sheet1_form label[for="inquiry[4][inspection]"]').hide();
	$('#sheet1_form input[name="inquiry[4][inspection]"]').parent('div').hide();
    } else {
	$('#sheet1_form label[for="inquiry[4][inspection]"]').show();
	$('#sheet1_form input[name="inquiry[4][inspection]"]').parent('div').show();
    }

    $('#sheet1_form select').selectmenu('refresh');
    $('#sheet1_form input[type="checkbox"]').checkboxradio('refresh');
    $('#sheet1_form input[type="radio"]').checkboxradio('refresh');
    $('#sheet1_form input[data-type="range"]').slider('refresh');
    $('#sheet1_form div[data-role="rangeslider"]').rangeslider('refresh');


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
	const thisbutton = $(this);
	const form = $('#sheet1_form');

	thisbutton.addClass('ui-disabled');
	if (!form.valid()) {
	    console.log('invalid');
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
		s1data = response.data;
		$('#staff_sheet1').remove();
		write_sheet1();
		thisbutton.removeClass('ui-disabled');
		reload = true;
		$('body').pagecontainer('change', '#staff_sheet1', { transition: 'slide', reverse: true });
		return false;
    	    })
    	    .fail(function(jqxhr,status,error) {
    		$.mobile.loading('hide');
    		console.log('fail');
		thisbutton.removeClass('ui-disabled');
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
	return (sel <= 16 || $trim(val) != '');
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

function medhist_add_item() {
    const cnt = $('.medhist').length + 1;
    let hText = 
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
    for (let y = 0; y <= 10; y++) {
	hText +=
	    '<option value="' + y + '">' + y + '年</option>';
    }
    hText +=
	'</select>'+
	'<select name="medhist['+cnt+'][period_month]" data-native-menu="false" index="'+cnt+'" class="s1medhist_period_month">'+
	'<option data-placeholder="true" value="">ケ月</option>';
    for (let m = 0; m <= 11; m++) {
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
    let hText = '';
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


// sheet2
$(document).on('click', 'button.s2check', function() {
    const button = $(this);
    const docid = $(this).attr('docid');
    $.ajax({
	url: 'ajax/update_sheet2_staff_checked.php',
	type: 'POST',
	dataType: 'json',
	data: { id: docid }
    })
	.done(function(response) {
	    console.log(response);
	    button.removeClass('ui-btn-b').removeClass('s2check').addClass('s2uncheck').addClass('ui-btn-a').text('　確認済み　');
	    reload = true;
	});
});

$(document).on('click', 'button.s2uncheck', function() {
    const button = $(this);
    const docid = $(this).attr('docid');
    $.ajax({
	url: 'ajax/update_sheet2_staff_unchecked.php',
	type: 'POST',
	dataType: 'json',
	data: { id: docid }
    })
	.done(function(response) {
	    console.log(response);
	    button.removeClass('ui-btn-b').removeClass('s2uncheck').addClass('s2check').addClass('ui-btn-b').text('　確認済みにする　');
	    reload = true;
	});
});

$(document).on('click', 'button.update_sheet2', function() {
    const docid = $(this).attr('docid');
    const index = $(this).attr('index');

    $('#sheet2_form input[name="docid"]').val(docid);
    $('#sheet2_form input[name="uid"]').val(playerdata.uid);

    // set href of back button
    $('#s2back').attr('href', '#staff_sheet2_'+index);
    $('#sheet2_submit').attr('back', '#staff_sheet2_'+index);
    $('#sheet2_submit').attr('index', index);

    $('body').pagecontainer('change', '#sheet2_p1', { transition: 'slide' });

});

$(document).on('pagebeforeshow', '#sheet2_p1', function() {
    console.log("pagebeforeshow: sheet2_p1");

    const sheet2 = $('#sheet2_p1');
    const docid = $('#sheet2_form input[name="docid"]').val();
    const data = s2data[docid];

    $('#sheet2_form input[name="date"]').val(data.date);
    $('#sheet2_form select[name="category_s"]').val(data.category_s);
    $('#sheet2_form select[name="category_d"]').val(data.category_d);
    if (data.stat != null) {
	$.each(data.stat, function(i, v) {
	    $('#sheet2_form input[name="stat['+i+']"]').val([v]);
	});
    }
    
    $('#sheet2_form input[name="sleep_usual"]').val(data.sleep_usual);
    $('#sheet2_form input[name="sleep_yesterday"]').val(data.sleep_yesterday);
    // p2
    for (let i = 1; i <= 25; i++) {
	$('#sheet2_form input[name="pain_now[front]['+i+']"]').val(data.pain_now.front[i]);
	$('#sheet2_form input[name="pain_past[front]['+i+']"]').val(data.pain_past.front[i]);
    }
    for (let i = 1; i <= 9; i++) {
	$('#sheet2_form input[name="pain_now[back]['+i+']"]').val(data.pain_now.back[i]);
	$('#sheet2_form input[name="pain_past[back]['+i+']"]').val(data.pain_past.back[i]);
    }
    $('#sheet2_form input[name="check"]').val([data.check]);

    // insert date in header
    const regmonth = parseInt(data.date.substr(5,2));
    const regday = parseInt(data.date.substr(8,2));
    $('#s2regdate').html(regmonth+'月'+regday+'日分');


    const c = ['#aaa','#ff0','#fc0','#f90','#f60','#f30'];
    $('#sheet2_p1 .mark').each(function() {
	const f = $(this).attr('for');
	const fx = $("#"+f).val();
	if (fx == 0) {
	    $(this).html('');
	} else {
	    $(this).html(fx);
	}
	$(this).css('background-color', c[fx]);
    });

    $('#sheet2_form select').selectmenu('refresh');
    $('#sheet2_form input[type="checkbox"]').checkboxradio('refresh');
    $('#sheet2_form input[data-type="range"]').slider('refresh');


});

let click;
if (typeof window.ontouchstart == 'undefined') {
    click = 'mousedown';
} else {
    click = 'tap';
}
$(document).on(click, '#sheet2_p1 .mark', function() {
    const c = ['#aaa','#ff0','#fc0','#f90','#f60','#f30'];
    const f = $(this).attr('for');
    let fx = $("#"+f).val();
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


$(document).on('click', '#sheet2_submit', function() {
    const thisbutton = $(this);
    const back = thisbutton.attr('back');
    const i = Number(thisbutton.attr('index'));
    const docid = $('#sheet2_form input[name="docid"]').val();
    
    thisbutton.addClass('ui-disabled');
    $.mobile.loading('show');
    $.ajax({
	url: 'ajax/put_sheet2.php',
	type: 'POST',
	dataType: 'json',
	data: $('#sheet2_form').serialize(),
	timeout: 10000
    })
	.done(function(response){
	    $.mobile.loading('hide');
	    s2data[docid] = response.data;
	    $(back).remove();
	    write_sheet2(i);
	    thisbutton.removeClass('ui-disabled');
	    reload = true;
	    $('body').pagecontainer('change', back, { transistion: 'slide', reverse: true });
	    return false;
	})
	.fail(function(response){
	    $.mobile.loading('hide');
	    console.log('fail');
	    thisbutton.removeClass('ui-disabled');
	    return false;
	});
    return false;

});


$(document).on('pagebeforeshow', '#staff_plist', function() {
    console.log('pagebeforeshow: staff_plist');

    if (reload) {
	$.mobile.loading('show');
	$.ajax({
	    url: 'ajax/search_alldata.php',
	    type: 'POST',
	    dataType: 'json',
	    data: { index: es_players+','+es_sheet1+','+es_sheet2, filter: {} },
	    timeout: 10000
	})
	    .done(function(response){
		console.log(response);
		responsecache = response;
		sortdata(responsecache);
		write_data(responsecache);
		$.mobile.loading('hide');
		reload = false;
	    })
	    .fail(function(response) {
		console.log(response);
		$.mobile.loading('hide');
		return false;
	    });
    }
    
});

$(document).on('pageshow', '#staff_plist', function() {
    if (backpos !== null) {
	$.mobile.silentScroll(backpos);
	backpos = null;
    }
});

$(document).on('change', 'select.filter', function() {
    sortdata(responsecache);
    write_data(responsecache);
    $('#staff_index_table').filterable('refresh');
});

$(document).on('click', '#filter_clear', function() {
    $('select[name="sort_by"]').val(['name_asc']);
    $('select[name="sort_by"]').selectmenu('refresh');
    $('select[name="filter_category"]').val([]);
    $('select[name="filter_category"]').selectmenu('refresh');
    $('select[name="filter_gender"]').val([]);
    $('select[name="filter_gender"]').selectmenu('refresh');
    $('select[name="filter_check"]').val([]);
    $('select[name="filter_check"]').selectmenu('refresh');
    
    sortdata(responsecache);
    write_data(responsecache);
    $('#staff_index_table').filterable('refresh');
});


function write_data(response) {
    const list = $('#staff_plist_list');
    list.empty();
    if (response.status != 'OK') {
	list.append('<div class="message">選手情報の取得に失敗しました。</div>');
    } else if (response.data.length == 0) {
	list.append('<div class="message">条件に合う選手がいません。</div>');
    } else {
	const f1 = $('select[name="filter_category"]').val(); // filter1
	const f2 = $('select[name="filter_gender"]').val(); // filter1
	const f3 = $('select[name="filter_check"]').val(); // filter2
	let hText = '';
	hText +=
	    '<table id="staff_index_table" data-role="table" data-mode="none" class="ui-responsive" data-filter="true" data-input="#key">'+
	    '<thead>'+
	    '<tr>'+
	    '<th class="plist_name">氏名</th>'+
//	    '<th class="plist_affil">所属</th>'+
	    '<th class="plist_category">階級</th>'+
	    '<th class="plist_gender">性別</th>'+
	    '<th class="plist_num">内科疾患</th>'+
	    '<th class="plist_num">整形疾患</th>'+
	    '<th>大会前CS</th>'+
	    '<th>試合当日CS</th>'+
	    '</tr>'+
	    '</thead>'+
	    '<tbody id="staff_plist_tbody">'+
	    '</tbody>'+
	    '</table>';
	list.append(hText);
	const e = $('#staff_plist_tbody');
	    
	$.each(response.data, function(i, v) {
	    let should_append = true;
	    const pd = v[es_players][Object.keys(v[es_players])[0]];

	    if (f1 !== null && !f1.includes(pd.category)) {
		should_append = false;
	    }
	    if (f2 !== null && !f2.includes(pd.gender)) {
		should_append = false;
	    }
	    hText =
		'<tr data-filtertext="'+h(pd.name_kana+pd.name)+'" class="player" index="'+i+'">'+
		'<td class="plist_name">'+h(pd.name)+'</td>'+
//		'<td class="plist_affil">'+h(pd.club)+'</td>'+
		'<td class="plist_category">'+categories[pd.category]+'</td>'+
		'<td class="plist_gender">'+genders[pd.gender]+'</td>';

	    let md = false;
	    let mdcnt = 0;
	    let od = false;
	    let odcnt = 0;
	    if (v[es_sheet1] != null) {
		const s1d = v[es_sheet1][Object.keys(v[es_sheet1])[0]];
		if (s1d['medhist'] != null) {
		    $.each(s1d['medhist'], function(i, v4) {
			if (v4.age != -1) {
			    md = true;
			    mdcnt++;
			}
		    });
		}
		if (s1d['allergy'] != null) {
		    $.each(s1d['allergy'], function(i, v4) {
			if (v4.yn != 0) {
			    md = true;
			    mdcnt++;
			}
		    });
		}
		if (s1d['pain'] != null) {
		    $.each(s1d['pain'], function(i, v4) {
			if (v4.age != -1) {
			    od = true;
			    odcnt++;
			}
		    });
		}
	    }
	    if (f3 !== null) {
		if (f3.includes('md') && f3.includes('od')) {
		    should_append = should_append && (md || od);
		} else if (f3.includes('md') && !f3.includes('od')) {
		    should_append = should_append && md;
		} else if (!f3.includes('md') && f3.includes('od')) {
		    should_append = should_append && od;
		}
	    }
	    hText += '<td class="plist_num">' + mdcnt + '</td>';
	    hText += '<td class="plist_num">' + odcnt + '</td>';

	    hText += '<td>';
	    if (v[es_sheet1] != null) {
		const date = new Date(v[es_sheet1][Object.keys(v[es_sheet1])[0]]['date']);
		//		hText += '<button class="s1_btn" data-mini="true" data-inline="true" index="'+i+'">'+y+'/'+m+'/'+d+'</button>';
		hText += date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate();
	    } else {
		hText += '<button type="button" data-mini="true" data-inline="true" index="'+i+'">代理入力</button>';
	    }
	    hText += '</td>';
	    hText += '<td>';
	    if (v[es_sheet2] != null) {
		let s2today = '';
		var statcnt = 0;
		var painmax = 0;
		var painmax_f = 0;
		var painmax_b = 0;
		$.each(v[es_sheet2], function(id, v3) {
		    const date = new Date(v3.date);
		    const today = new Date();
		    if (date.getFullYear() == today.getFullYear() &&
			date.getMonth() == today.getMonth() &&
			date.getDate() == today.getDate()) {
			if (v3.staff_checked != null) {
			    s2today = '確認済';
			} else {
			    s2today = '入力済';
			}
			statcnt = (v3.stat != null ? Object.keys(v3.stat).length : 0);
			painmax_f = Math.max.apply(null, objValues(v3.pain_now.front));
			painmax_b = Math.max.apply(null, objValues(v3.pain_now.back));
			painmax = Math.max(painmax_f, painmax_b);
			s2today += '(体調'+statcnt+',痛み'+painmax+')';
			
		    }
		});

		hText += s2today;
	    }
	    hText += '</td>';
	    hText += '</tr>';

	    if (should_append) {
		e.append(hText);
		if (mdcnt + odcnt > 0) {
		    $('tr.player[index="'+i+'"]').addClass('highlight');
		}
	    }
	});
    }
    list.enhanceWithin();

};

$(document).on('click', '.player', function() {
    const index = $(this).attr('index');
    backpos = $(this).position().top - $('#staff_plist div[data-role="header"]').height();
    if (backpos < 0)
	backpos = null;
    go(index);
});
    

function sortdata(response) {
    // sorting
    const sc = $('select[name="sort_by"]').val();

    if (sc == "name_asc" || sc == "name_desc") {
	var asc = (sc == "name_asc" ? 1 : -1);
	response.data.sort(function(a,b) {
	    const player_a = a[es_players][Object.keys(a[es_players])[0]];
	    const player_b = b[es_players][Object.keys(b[es_players])[0]];
	    const a_name = player_a.name_kana;
	    const b_name = player_b.name_kana;
	    const a_cat = player_a.category;
	    const b_cat = player_b.category;
	    if (a_name < b_name) {
		return -1 * asc;
	    } else if (a_name > b_name) {
		return 1 * asc;
	    } else if (a_cat < b_cat) {
		return -1;
	    } else if (a_cat > b_cat) {
		return 1;
	    } else {
		return 0;
	    }
	});
    } else if (sc == "cat_asc" || sc == "cat_desc") {
	const asc = (sc == "cat_asc" ? 1 : -1);
	response.data.sort(function(a, b) {
	    const player_a = a[es_players][Object.keys(a[es_players])[0]];
	    const player_b = b[es_players][Object.keys(b[es_players])[0]];
	    const a_cat = player_a.category;
	    const b_cat = player_b.category;
	    const a_name = player_a.name_kana;
	    const b_name = player_b.name_kana;
	    if (a_cat < b_cat) {
		return -1 * asc;
	    } else if (a_cat > b_cat) {
		return 1 * asc;
	    } else if (a_name < b_name) {
		return -1;
	    } else if (a_name > b_name) {
		return 1;
	    } else {
		return 0;
	    }
	});
    }
    console.log(response);
    return response;
}
