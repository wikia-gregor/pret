$(function() {
	function renderReportsPerDays( reports ) {
		var max = parseInt( reports[0], 10 );

		// show total number of reports === reports from 30 days for now
		$( "#reportsNo" ).text( max );

		var reportBarsWrapper = $( "#reportsBars" );
		var reportsCtx = reportBarsWrapper.get(0).getContext("2d");
		var data = {
			labels: [ "30 days", "7 days", "Yesterday" ],
			datasets: [{
				fillColor: "#2d6b6b",
				strokeColor: "#59c39d",
				data: reports
			}]
		};
		var options = {
			scaleOverride: true,
			scaleSteps: max + 2,
			scaleStepWidth : 1,
			scaleStartValue : 0
		};

		new Chart( reportsCtx ).Bar( data, options );

		$( "#reportsBarsLoader" ).hide();
		reportBarsWrapper.show();
	}

	function renderReportsPerCity( reports ) {
		// mocked data
		var cities = [],
			cityReports = [],
			max = 0;
		Object.keys( reports ).forEach(function( key ){
			cities.push( key );
			cityReports.push( reports[key] );
			max = reports[key] > max ? reports[key] : max;
		});

		var reportsByCityBarsWrapper = $( "#reportsByCityBars" );
		var cityReportsCtx = reportsByCityBarsWrapper.get(0).getContext("2d");

		// displaying the reports per city chart
		var data = {
			labels: cities,
			datasets: [{
				fillColor: "#2d6b6b",
				strokeColor: "#59c39d",
				data: cityReports
			}]
		};
		var options = {
			scaleOverride: true,
			scaleSteps : max,
			scaleStepWidth : 1,
			scaleStartValue : 0
		};

		new Chart( cityReportsCtx ).Bar( data, options );

		$( "#reportsByCityBarsLoader" ).hide();
		reportsByCityBarsWrapper.show();
	}

	var reports = [];
	Parse.Promise.when( [
			Parse.Cloud.run( 'getNumberOfReports', { 'days': 30 } ),
			Parse.Cloud.run( 'getNumberOfReports', { 'days': 7 } ),
			Parse.Cloud.run( 'getNumberOfReports', { 'days': 1 } )
		] ).then(
		function( a, b, c ) {
			reports.push( a, b, c );
			renderReportsPerDays( reports );
		},
		function( error ) {
			console.error( 'Could not get reports (' + error.message + ')' );
		}
	);

	Parse.Cloud.run( 'getReportsPerField', { group_name: 'locality' }, {
		success: function (reports) {
			renderReportsPerCity(reports)
		},
		error: function (error) {
			console.log(error);
		}
	});
});