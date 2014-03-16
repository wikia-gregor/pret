var script = '<script type="text/javascript" src="js/vendors/markerclusterer';
if (document.location.search.indexOf('compiled') !== -1) {
	script += '_packed';
}
script += '.js"><' + '/script>';
document.write(script);


// custom markers
var iconBase = '';
var icons = {
	test: {
		icon: new google.maps.MarkerImage(
			iconBase + 'marker.png', //url
			new google.maps.Size(30, 30),
			new google.maps.Point(0, 0),
			new google.maps.Point(0, 0),
			new google.maps.Size(30, 30)
		)
	},
	library: {
		icon: iconBase + 'library_maps.png'
	},
	info: {
		icon: iconBase + 'info-i_maps.png'
	}
};


function initialize() {
	console.log('initialize');
	Parse.initialize("5bPOC1kbVMfqqw7QbW1SUH1YwZqbkLhbZziuaxmM", "kkU67mDdoOxhwj4yLEZs3LhXXKw2C2QzFDGLPkxB");

	var cities = new Array();

	cities['Warsaw'] = new google.maps.LatLng(52.229676, 21.012229);
	cities['Poznan'] = new google.maps.LatLng(52.406374, 16.925168);
	var center = cities['Warsaw'];

	var map = new google.maps.Map(document.getElementById('map'), {
	zoom: 10,
	center: center,
	mapTypeId: google.maps.MapTypeId.ROADMAP
	});


//Initialize map markers when it's ready
google.maps.event.addListenerOnce(map, 'idle', function() {
	if ( mapHelper.canRun() ) {
		mapHelper.LastChange = new Date().getTime();
		mapHelper.onMapChange(map);
	}
// do something only the first time the map is loaded
});
}
google.maps.event.addDomListener(window, 'load', initialize);

var mapHelper = {};

// markers storage
mapHelper.markers = {};
mapHelper.markersIb = [];
mapHelper.infobox = new InfoBox();
mapHelper.threshold = 5000;
mapHelper.LastChange = new Date().getTime()-(mapHelper.threshold+1);
mapHelper.canRun = function() {
	timestamp = new Date().getTime();
	console.log(timestamp);
	console.log(timestamp - mapHelper.LastChange);
	if ( (timestamp - mapHelper.LastChange) > mapHelper.threshold ) {
		return true
	}
};


mapHelper.onMapChange = function(map) {
	var northEast = map.getBounds().getNorthEast();
	var southWest = map.getBounds().getSouthWest();

	var pSouthwest = new Parse.GeoPoint(southWest.d, southWest.e);
	var pNortheast = new Parse.GeoPoint(northEast.d, northEast.e);
	var infowindow = new google.maps.InfoWindow();

	// Parse getPointsInArea
	Parse.Cloud.run('getPointsInArea', {'south_west':pSouthwest, 'north_east':pNortheast}, {
		success: function(result) {
			// Add markers
			result.forEach(function(report) {
				var geoPoint = report.get('geo_point'),
					reportId = report.get('id'),
					latLng = new google.maps.LatLng(geoPoint.latitude, geoPoint.longitude),
					content = report.id,

					marker = new google.maps.Marker({
						position: latLng,
						map: map,
						title: report.get('name')
					});
				google.maps.event.addListener(marker, 'click', function() {
					infowindow.setContent(content);
					infowindow.open(map, marker);
				});
			});

			var markerCluster = new MarkerClusterer(map, mapHelper.markers);
		},
		error: function(error) {
		}
	});


}