$(document).on('pagecreate', '#staff_stats_s1', function() {
    const catcolors = {
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
	url: 'ajax/stat_medhist.php',
	type: 'POST',
	datatype: 'json',
	data: {}
    })
	.done(function(response) {
	    console.log(response);
	    var ctx = $('#Chart_medhist')[0].getContext('2d');

	    var data = response.data;
	    var labels = data.labels;
	    var datasets = data.datasets;
	    $.each(datasets, function(i,v) {
		datasets[i].backgroundColor = catcolors[v.label];
	    });
	    console.log(datasets);
	    var myChart = new Chart(ctx, {
		type: 'bar',
		
		data : {
		    labels: labels,
		    datasets: datasets
		},
		options: {
		    maintainAspectRatio: false,
		    legend: {
			display: true
		    },
		    title: {
			display: true,
			text: '既往歴・アレルギー（延べ人数）',
			fontSize: 18,
			fontColor: 'black'
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
		    }
		}
	    });
	})
	.fail(function(response) {
	});

    $.ajax({
	url: 'ajax/stat_pain.php',
	type: 'POST',
	datatype: 'json',
	data: {}
    })
	.done(function(response) {
	    console.log(response);
	    var ctx = $('#Chart_pain')[0].getContext('2d');

	    var data = response.data;
	    var labels = data.labels;
	    var datasets = data.datasets;
	    $.each(datasets, function(i,v) {
		datasets[i].backgroundColor = catcolors[v.label];
	    });
	    console.log(datasets);
	    var myChart = new Chart(ctx, {
		type: 'bar',
		
		data : {
		    labels: labels,
		    datasets: datasets
		},
		options: {
		    maintainAspectRatio: false,
		    legend: {
			display: true
		    },
		    title: {
			display: true,
			text: '痛み・ケガ（延べ人数）',
			fontSize: 18,
			fontColor: 'black'
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
		    }
		}
	    });
	})
	.fail(function(response) {
	});

	      
});

$(document).on('pagecreate', '#staff_stats_s2', function() {
    const catcolors = {
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
	url: 'ajax/stat_condition.php',
	type: 'POST',
	datatype: 'json',
	data: {}
    })
	.done(function(response) {
	    console.log(response);
	    var ctx = $('#Chart_condition')[0].getContext('2d');

	    var data = response.data;
	    var labels = data.labels;
	    var datasets = data.datasets;
	    $.each(datasets, function(i,v) {
		datasets[i].backgroundColor = catcolors[v.label];
	    });
	    console.log(datasets);
	    var myChart = new Chart(ctx, {
		type: 'bar',
		
		data : {
		    labels: labels,
		    datasets: datasets
		},
		options: {
		    maintainAspectRatio: false,
		    legend: {
			display: true
		    },
		    title: {
			display: true,
			text: '本日の体調（チェック数）',
			fontSize: 18,
			fontColor: 'black'
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
	})
	.fail(function(response) {
	});

    $.ajax({
	url: 'ajax/stat_s2_pain.php',
	type: 'POST',
	datatype: 'json',
	data: {}
    })
	.done(function(response) {
	    console.log(response);
	    var ctx = $('#Chart_s2_pain')[0].getContext('2d');

	    var data = response.data;
	    var labels = data.labels;
	    var datasets = data.datasets;
	    $.each(datasets, function(i,v) {
		datasets[i].backgroundColor = catcolors[v.label];
	    });
	    console.log(datasets);
	    var myChart = new Chart(ctx, {
		type: 'bar',
		
		data : {
		    labels: labels,
		    datasets: datasets
		},
		options: {
		    maintainAspectRatio: false,
		    legend: {
			display: true
		    },
		    title: {
			display: true,
			text: '現在の痛み（最大値）',
			fontSize: 18,
			fontColor: 'black'
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
	})
	.fail(function(response) {
	});

	      
});

$(document).on('pagecreate', '#staff_stats_treatment', function() {
    const tcolors = {
	1: 'rgba(255,0,41,0.4)',
	2: 'rgba(55,126,184,0.4)',
	3: 'rgba(102,166,30,0.4)',
	4: 'rgba(152,78,163,0.4)',
	5: 'rgba(0,210,213,0.4)'
    };

    $.ajax({
	url: 'ajax/stat_treatment.php',
	type: 'POST',
	datatype: 'json',
	data: {}
    })
	.done(function(response) {
	    console.log(response);
	    var ctx1 = $('#Chart_treatment1')[0].getContext('2d');

	    var data = response.data;
	    var datasets = [];
	    for (i in data.treatment) {
		datasets.push({
		    label: treatmentstr[i],
		    data: data.treatment[i],
		    backgroundColor: tcolors[i],
		    stack: 'Stack 1'
		});
	    }
	    console.log(datasets);
	    var Chart_treatment1 = new Chart(ctx1, {
		type: 'bar',
		
		data : {
		    labels: data.dates,
		    datasets: datasets
		},
		options: {
		    maintainAspectRatio: false,
		    title: {
			display: true,
			text: '日別処置件数',
			fontSize: 18,
			fontColor: 'black'
		    },
		    legend: {
			display: true,
			position: 'bottom'
		    },
		    scales: {
			yAxes: [{
			    ticks: {
				beginAtZero: true,
				min: 0,
				callback: function(val) { return ((val % 1) == 0 ? val+' 件' : ''); }
			    },
			    stacked: true,
			}],
			xAxes: [{
			    stacked: true
			}]
		    }
		}
	    });
	})
	.fail(function(response) {
	});

    $.ajax({
	url: 'ajax/stat_treatment2.php',
	type: 'POST',
	datatype: 'json',
	data: {}
    })
	.done(function(response) {
	    console.log(response);
	    var ctx2 = $('#Chart_treatment2')[0].getContext('2d');
	    var ctx3 = $('#Chart_treatment3')[0].getContext('2d');

	    var data_i = response.data_i;
	    var datasets_i = [];
	    for (i in data_i.datasets) {
		datasets_i.push({
		    label: injuries[i],
		    data: data_i.datasets[i],
		    backgroundColor: tcolors[i%5+1],
		    stack: 'Stack 1'
		});
	    }
	    console.log(datasets_i);
	    var Chart_treatment2 = new Chart(ctx2, {
		type: 'bar',
		
		data : {
		    labels: data_i.labels,
		    datasets: datasets_i
		},
		options: {
		    maintainAspectRatio: false,
		    title: {
			display: true,
			text: '日別発生件数（ケガ）',
			fontSize: 18,
			fontColor: 'black'
		    },
		    legend: {
			display: true,
			position: 'bottom'
		    },
		    scales: {
			yAxes: [{
			    ticks: {
				beginAtZero: true,
				min: 0,
				callback: function(val) { return ((val % 1) == 0 ? val+' 件' : ''); }
			    },
			    stacked: true,
			}],
			xAxes: [{
			    stacked: true
			}]
		    }
		}
	    });

	    var data_d = response.data_d;
	    var datasets_d = [];
	    for (i in data_d.datasets) {
		datasets_d.push({
		    label: diseases[i],
		    data: data_d.datasets[i],
		    backgroundColor: tcolors[i%5+1],
		    stack: 'Stack 1'
		});
	    }
	    console.log(datasets_d);
	    var Chart_treatment3 = new Chart(ctx3, {
		type: 'bar',
		
		data : {
		    labels: data_d.labels,
		    datasets: datasets_d
		},
		options: {
		    maintainAspectRatio: false,
		    title: {
			display: true,
			text: '日別発生件数（疾病）',
			fontSize: 18,
			fontColor: 'black'
		    },
		    legend: {
			display: true,
			position: 'bottom'
		    },
		    scales: {
			yAxes: [{
			    ticks: {
				beginAtZero: true,
				min: 0,
				callback: function(val) { return ((val % 1) == 0 ? val+' 件' : ''); }
			    },
			    stacked: true,
			}],
			xAxes: [{
			    stacked: true
			}]
		    }
		}
	    });

	})
	.fail(function(response) {
	});

	      
});
