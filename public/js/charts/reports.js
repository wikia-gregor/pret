$(function() {
	// mocked data
	var reportsNo = '812,348,234';
	var reports = [ 60, 40, 20, 5 ];
	var cities = [ "Poznań", "Warszawa", "Kraków", "Berlin", "Olsztyn" ];
	var cityReports = [ 80, 75, 76, 20, 82 ];

	var reportsNoWrapper = $( "#reportsNo" );
	var reportsCtx = $( "#reportsBars" ).get(0).getContext("2d");
	var cityReportsCtx = $( "#reportsByCityBars" ).get(0).getContext("2d");

	// show total number of reports
	reportsNoWrapper.text( reportsNo );

	var data = {
		labels: [ "Month ago", "Week ago", "Yesterday", "Today" ],
		datasets: [{
			fillColor: "rgba(151,187,205,0.5)",
			strokeColor: "rgba(151,187,205,1)",
			data: reports
		}]
	};
	var options = {};
	new Chart( reportsCtx ).Bar( data, options );

	// displaying the reports per city chart
	var data = {
		labels: cities,
		datasets: [{
			fillColor: "rgba(151,187,205,0.5)",
			strokeColor: "rgba(151,187,205,1)",
			data: cityReports
		}]
	};
	var options = {
		scaleOverride: true,
		scaleSteps : 10,
		scaleStepWidth : 10,
		scaleStartValue : 0
	};
	new Chart( cityReportsCtx ).Bar( data, options );
});