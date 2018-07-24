var plist = null;

// import_players.php
$(document).on('pagecreate','#admin_import', function() {
    console.log('pagecreate: admin_import');

    $(document).on('vclick', '#sendfile', function() {
	$('#message').empty();
	let fd = new FormData();
	let file = $('input[name="csvfile"]');
	if (file.val() !== '') {
	    fd.append('file', file.prop('files')[0]);
	    fd.append('dir', file.val());
	
	    let list = $('#import_data_list');
	    list.empty();
	    $.mobile.loading('show');
	    $.ajax({
		url: 'ajax/analyzecsv.php',
		type: 'POST',
		dataType: 'json',
		data: fd,
		processData: false,
		contentType: false,
		timeout: 3000
	    })
		.done(function(response) {
		    console.log(response);
		    plist = response;
		    write_data();
		    
		    $.mobile.loading('hide');
		    return false;
		})
		.fail(function(response) {
		    console.log(response);
		    $.mobile.loading('hide');
		    return false;
		});
	}
	return false;
    });
    
    $(document).on('vclick', '#register', function() {
	$('#message').empty();
	if (plist !== null) {
	    $.mobile.loading('show');
	    console.log(plist);
	    $.ajax({
		url: 'ajax/import_players.php',
		type: 'POST',
		dataType: 'json',
		data: { "list": JSON.stringify(plist) },
		timeout: 10000
	    })
		.done(function(response) {
		    console.log(response);
		    $('#import_data_list').empty();
		    $('#message').html(response.count+'件の選手データをインポートしました。');
		    $.mobile.loading('hide');
		    return false;
		})
		.fail(function(response) {
		    console.log(response);
		    $('#message').html('インポートに失敗しました。');
		    $.mobile.loading('hide');
		    return false;
		});
	}
	return false;
    });
    
});

function write_data() {
    let e = $('#import_data_list');
    let hText = '';
    hText = '<table><thead><tr><th>カテゴリ</th><th>性別</th><th>氏名</th><th>かな</th><th>都道府県</th><th>所属</th><th>生年月日</th><th>ユーザID</th><th>PW</th></tr></thead>';
    hText += '<tbody>';
    $.each(plist, function(i, pd) {
	hText += '<tr><td>'+pd.category+'</td><td>'+pd.gender+'</td><td>'+pd.name+'</td><td>'+pd.name_kana+'</td><td>'+prefs[pd.pref]+'</td><td>'+pd.club+'</td><td>'+pd.birthdate+'</td><td>'+pd.uid+'</td><td>'+pd.password+'</td></tr>';
    });
    hText += '</tbody></table>';
    hText += '<button type="button" id="register">登録</button>';
    e.html(hText);
    e.enhanceWithin();
}
