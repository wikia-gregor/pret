$(function() {
	Parse.Cloud.run( 'getReportsPerCategory', {} ).then(
		function( result ) {
			render( result );
		},
		function( error ) {
			console.error( 'Could not get categories (' + error.message + ')' );
		}
	);

	function render( categories ) {
		var options = {};
		var data = [];
		var html = '';

		var categoriesPieWrapper = $( "#categoriesPie" );
		var pieCtx = categoriesPieWrapper.get( 0 ).getContext( "2d" );

		var rowTpl = '<tr><td><span style="background-color: {{color}};"></span></td><td>{{name}} ({{amount}})</td></tr>';
		var colors = [ '#585656', '#e1e1e1', '#f92531', '#59c39d', '#2d6b6b' ];

		for( name in categories ) {
			var color = colors.pop();
			color = ( color !== '' ? color : '#ff0000' );
			var value = categories[name];
			var el = {
				'value': value,
				'color': color
			};

			html += Mustache.render( rowTpl, {
				'color': color,
				'name': name,
				'amount': value
			} );

			data.push( el );
		}

		new Chart( pieCtx ).Pie( data, options );

		categoriesPieWrapper.parent().append( '<table class="legend">' + html + '</table>' );
		$( "#categoriesPieLoader" ).hide();
		$( "#categoriesPieContainer" ).show();
	}

});
