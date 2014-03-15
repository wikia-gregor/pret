$(function() {
	// mocked data
	var categoriesColors = [ "#FF0000", "#E0E4CC", "#69D2E7", "#F38630" ];
	var categoryReports = [ 40, 15, 5, 22 ];

	var pieCtx = $( "#categoriesPie" ).get(0).getContext("2d");
	var data = [];
	var l = categoryReports.length;
	for( var i = 0; i < l; i++ ) {
		var el = {
			value: categoryReports[i],
			color: categoriesColors[i]
		};

		data.push(el);
	}

	var options = {};
	new Chart( pieCtx ).Pie( data, options );
});