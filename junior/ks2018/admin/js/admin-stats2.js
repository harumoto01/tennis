$(document).on('pagecreate', '#admin_stats2', function() {
    const tcolors = {
	'12B': 'rgba(255,0,41,0.4)',
	'12G': 'rgba(55,126,184,0.4)',
	'14B': 'rgba(102,166,30,0.4)',
	'14G': 'rgba(152,78,163,0.4)',
	'16B': 'rgba(0,210,213,0.4)',
	'16G': 'rgba(255,127,0,0.4)',
	'18B': 'rgba(175,141,0,0.4)',
	'18G': 'rgba(127,128,205,0.4)'
    };
    $.ajax({
	url: 'ajax/stats2.php',
	type: 'POST',
	datatype: 'json',
	data: {}
    })
	.done(function(response) {
	    console.log(response);
	    var ctx1 = $('#Chart_s1_1')[0].getContext('2d');
	    var ctx2 = $('#Chart_s1_2')[0].getContext('2d');

	    var data = response.data;
	    var labels = data.labels;
	    var datasets1 = data.datasets;
	    var datasets = [];
	    var cat;
	    for (cat in datasets1) {
		datasets.push({'data': datasets1[cat], 'label': cat, backgroundColor: tcolors[cat]});
	    }
	    var Chart_s1_1 = new Chart(ctx1, {
		type: 'bar',

		data: {
		    labels: labels,
		    datasets: datasets
		},

		options: {
		    maintainAspectRatio: false,
		    legend: {
			display: true,
		    },
		    title: {
			display: true,
			fontSize: 16,
			text: '日別登録人数'
		    },
		    scales: {
			yAxes: [{
			    ticks: {
				beginAtZero: true,
				min: 0,
				callback: function(val) { return ((val % 1) == 0 ? val+' 人' : ''); }
			    },
			    stacked: true
			}],
			xAxes: [{
			    stacked: true
			}]

		    },
		    tooltips: {
		    	callbacks: {
		    	    label: function(item, data) {
		    		return data.datasets[item.datasetIndex].label + ": "+data.datasets[item.datasetIndex].data[item.index] + ' 人';
		    	    }
		    	}
		    }
		}
	    });

	    var labels2 = Object.keys(data.datasets);
	    var datasets2 = [];
	    var cnt;
	    for (i in data.datasets) {
		cnt = 0;
		$.each(data.datasets[i], function(j,v) {
		    cnt += v;
		});
		datasets2.push(cnt);
	    }
	    var colors2 = [];
	    for (i in tcolors) {
		colors2.push(tcolors[i]);
	    }
	    var Chart_s1_2 = new Chart(ctx2, {
		type: 'bar',

		data: {
		    labels: labels2,
		    datasets: [
			{ data: datasets2,
			  backgroundColor: colors2 }
		    ]
		},

		options: {
		    maintainAspectRatio: false,
		    legend: {
			display: false
		    },
		    title: {
			display: true,
			fontSize: 16,
			text: 'カテゴリー別登録人数'
		    },
		    scales: {
			yAxes: [{
			    ticks: {
				beginAtZero: true,
				min: 0,
				callback: function(val) { return ((val % 1) == 0 ? val+' 人' : ''); }
			    },
			    stacked: false
			}],
			xAxes: [{
			    stacked: false
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
    
    $.ajax({
	url: 'ajax/stats_sheet2.php',
	type: 'POST',
	datatype: 'json',
	data: {}
    })
	.done(function(response) {
	    console.log(response);
	    var ctx1 = $('#Chart_s2_1')[0].getContext('2d');
	    var ctx2 = $('#Chart_s2_2')[0].getContext('2d');

	    var data = response.data;
	    var labels = data.labels;
	    var datasets1 = data.datasets;
	    var datasets = [];
	    var cat;
	    for (cat in datasets1) {
		datasets.push({'data': datasets1[cat], 'label': cat, backgroundColor: tcolors[cat]});
	    }
	    var Chart_s2_1 = new Chart(ctx1, {
		type: 'bar',

		data: {
		    labels: labels,
		    datasets: datasets
		},

		options: {
		    maintainAspectRatio: false,
		    legend: {
			display: true,
		    },
		    title: {
			display: true,
			fontSize: 16,
			text: '日別登録人数'
		    },
		    scales: {
			yAxes: [{
			    ticks: {
				beginAtZero: true,
				min: 0,
				callback: function(val) { return ((val % 1) == 0 ? val+' 人' : ''); }
			    },
			    stacked: true
			}],
			xAxes: [{
			    stacked: true
			}]

		    },
		    tooltips: {
		    	callbacks: {
		    	    label: function(item, data) {
		    		return data.datasets[item.datasetIndex].label + ": "+data.datasets[item.datasetIndex].data[item.index] + ' 人';
		    	    }
		    	}
		    }
		}
	    });

	    var labels2 = Object.keys(data.datasets);
	    var datasets2 = [];
	    var cnt;
	    for (i in data.datasets) {
		cnt = 0;
		$.each(data.datasets[i], function(j,v) {
		    cnt += v;
		});
		datasets2.push(cnt);
	    }
	    var colors2 = [];
	    for (i in tcolors) {
		colors2.push(tcolors[i]);
	    }
	    var Chart_s2_2 = new Chart(ctx2, {
		type: 'bar',

		data: {
		    labels: labels2,
		    datasets: [
			{ data: datasets2,
			  backgroundColor: colors2 }
		    ]
		},

		options: {
		    maintainAspectRatio: false,
		    legend: {
			display: false
		    },
		    title: {
			display: true,
			fontSize: 16,
			text: 'カテゴリー別登録人数（延べ人数）'
		    },
		    scales: {
			yAxes: [{
			    ticks: {
				beginAtZero: true,
				min: 0,
				callback: function(val) { return ((val % 1) == 0 ? val+' 人' : ''); }
			    },
			    stacked: false
			}],
			xAxes: [{
			    stacked: false
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
