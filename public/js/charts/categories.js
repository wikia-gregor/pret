$(function() {
	// mocked data
	var categoriesNames = [ "Holes", "Signs broken", "Signs missing", "Garbage" ];
	var categoriesColors = [ "#FF0000", "#E0E4CC", "#69D2E7", "#F38630" ];
	var categoryReports = [ 40, 15, 5, 22 ];

	var pieCtx = $( "#categoriesPie" ).get(0).getContext("2d");
	var data = [];
	var l = categoryReports.length;
	var rowTpl = '<tr><td><span style="background-color: {{color}};"></span></td><td>{{name}}</td></tr>';
	var html = '';
	for( var i = 0; i < l; i++ ) {
		var color = categoriesColors[i];
		var el = {
			value: categoryReports[i],
			color: color
		};

		html += Mustache.render( rowTpl, { 'color': color, name: categoriesNames[i] } );
		data.push(el);
	}

	var options = {};
	new Chart( pieCtx ).Pie( data, options );

	$( "#categoriesPie" ).parent().append( '<table class="legend">' + html + '</table>' );
});
