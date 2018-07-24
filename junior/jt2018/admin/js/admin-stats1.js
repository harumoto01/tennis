$(document).on('pagecreate', '#admin_stats1', function() {
    const tcolors = {
	1: 'rgb(255,255,0)',
	2: 'rgb(255,0,255)',
	3: 'rgb(0,255,255)',
	4: 'rgb(255,0,0)',
	5: 'rgb(0,255,0)'
    };
    $.ajax({
	url: 'ajax/stats1.php',
	type: 'POST',
	datatype: 'json',
	data: {}
    })
	.done(function(response) {
	    console.log(response);
	    var ctx = $('#myChart')[0].getContext('2d');

	    var data = response.data;
	    console.log(data);
	    let labels = [];
	    let datasets = [];
	    for (i in data) {
		labels.push(data[i].key_as_string);
		datasets.push(data[i].doc_count);
	    }
	    var myChart = new Chart(ctx, {
		type: 'bar',

		data: {
		    labels: labels,
		    datasets: [{
			data: datasets,
			backgroundColor: 'rgb(0,200,0)'
		    }]
		},

		options: {
		    legend: {
			display: false
		    },
		    title: {
			display: true,
			fontSize: 16,
			text: '登録人数'
		    },
		    scales: {
			yAxes: [{
			    ticks: {
				beginAtZero: true,
				min: 0,
				callback: function(val) { return ((val % 1) == 0 ? val+' 人' : ''); }
			    }
			}]
		    },
		    tooltips: {
			callbacks: {
			    label: function(item, data) {
				return data.datasets[0].data[item.index] + ' 人';
			    }
			}
		    }
		}
	    });
	})
	.fail(function(response) {
	});
    
	      
});
