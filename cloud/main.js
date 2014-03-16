// TODO: validate data

function getTimestamp() {
	return new Date();
}

function daysAgo(days) {
	return new Date(getTimestamp().getTime() - (days * 86400000));
}


function getPlaceData( geoPoint ) {
	return Parse.Cloud.httpRequest({
		url: [
			'https://maps.googleapis.com/maps/api/geocode/json?latlng=',
			geoPoint.latitude,
			',',
			geoPoint.longitude,
			'&sensor=false'
		].join('')
	});
}

function getGeoFields (data) {
	var result = {
		locality: '',
		country: ''
	};
	if (data && data.results && data.results[0]) {
		data.results[0].address_components.forEach(function(row) {
			if (row.types.indexOf('locality') != -1 ) {
				result.locality = row.long_name;
			}
			if (row.types.indexOf('country') != -1 ) {
				result.country = row.long_name;
			}
		});
	}
	return result;
}

var Category = Parse.Object.extend('Category');
	CategoryCollection = Parse.Collection.extend({
		model: Category
	});

	Status = Parse.Object.extend('Status');
	StatusCollection = Parse.Collection.extend({
		model: Status
	}),

	Report = Parse.Object.extend('Report'),
	ReportCollection = Parse.Collection.extend({
		model: Report
	}),

	ReportUpdate = Parse.Object.extend('ReportUpdate'),
	ReportUpdateCollection = Parse.Collection.extend({
		model: ReportUpdate
	});

// Get list of categories
Parse.Cloud.define('getCategories', function(request, response) {
	new CategoryCollection().fetch({
		success: function(results) {
			response.success(results);
		},
		error: function(error) {
			response.error(error);
		}
	});
});

// Get list of statuses
Parse.Cloud.define('getStatuses', function(request, response) {
	new StatusCollection().fetch({
		success: function(results) {
			response.success(results);
		},
		error: function(error) {
			response.error(error);
		}
	});
});

// Get list of statuses
Parse.Cloud.define('getNumberOfReports', function(request, response) {
	var days = request.params.days || 10,
		status_id = request.params.status_id || false,
		category_id = request.params.category_id || false,
		query = new Parse.Query(Report);

	if ( status_id ) {
		query.equalTo('status_id', status_id);
	}
	if ( category_id ) {
		query.equalTo('category_id', category_id);
	}
	query.greaterThan('created', daysAgo(days));
	query.count({
		success: function(count) {
			response.success(count);
		},
		error: function(error) {
			response.error(error);
		}
	});
});

Parse.Cloud.define('addReport', function(request, response) {
	var geo_point = request.params.geo_point,
		name = request.params.name,
		category_id = request.params.category_id,
		status_id = request.params.status_id,
		description = request.params.description,
		file = request.params.file,
		user = request.params.user,
		category = new Category(),
		status = new Status(),
		now = getTimestamp(),
		file_url = file ? file.url() : '';
	category.id = category_id;
	status.id = status_id;
	getPlaceData(geo_point ).then(function (geoResponse) {
		var geoObject = JSON.parse(geoResponse.text ),
			geoFields = getGeoFields(geoObject);
		new Report().save({
			geo_point: geo_point,
			name: name,
			category_id: category_id,
			category: category,
			status_id: status_id,
			status: status,
			description: description,
			user: user,
			file: file,
			file_url: file_url,
			created: now,
			locality: geoFields.locality,
			country: geoFields.country
		}, {
			success: function(report) {
				var reportUpdate = new ReportUpdate();
				reportUpdate.save({
					geo_point: geo_point,
					user: Parse.User.current(),
					description: description,
					report_id: report.id,
					report: report,
					file: file,
					file_url: file_url,
					status_id: status_id,
					status: status,
					user: user,
					created: now
				}, {
					success: function(reportUpdate) {
						report.updates = [reportUpdate];
						response.success(report);
					},
					error: function(error) {
						response.error(error);
					}
				});
			},
			error: function(error) {
				response.error(error);
			}
		});
	});
});

Parse.Cloud.define('addReportUpdate', function(request, response) {
	var report_id = request.params.report_id || null,
		description = request.params.description || '',
		status_id = request.params.status_id,
		user = request.params.users,
		file = request.params.file,
		file_url = file ? file.url() : '';
	new ReportUpdate().save({
		report_id: report_id,
		description: description,
		status_id: status_id,
		user: user,
		file: file,
		file_url: file_url
	}, {
		success: function(reportUpdate) {
			response.success(reportUpdate);
		},
		error: function(error) {
			response.error(error);
		}
	});

});

Parse.Cloud.define('getReport', function(request, response) {
	var report_id = request.params.report_id,
		query = new Parse.Query(Report);

	query.equalTo('id', report_id);
	query.first({
		success: function (report) {
			query = new Parse.Query(ReportUpdate);
			query.equalTo('report_id', report_id);
			query.find({
				success: function(reportUpdates){
					report.updates = reportUpdates;
					response.success(report);
				},
				error: function(error) {
					response.error(error);
				}
			});

		},
		error: function(error) {
			response.error(error);
		}
	});
});

Parse.Cloud.define('getNearestReports', function(request, response) {
	var limit = request.params.limit,
		geo_point = request.params.geo_point,
		query = new Parse.Query(Report);

	query.near('geo_point', geo_point);
	query.limit(limit);
	query.find({
		success: function(reports) {
			response.success(reports);
		},
		error: function(error) {
			response.error(error);
		}
	});
});

Parse.Cloud.define('getPointsInArea', function(request, response) {
	var south_west = request.params.south_west,
		north_east = request.params.north_east,
		query = new Parse.Query(Report);
	query.withinGeoBox('geo_point', south_west, north_east);
	query.include('category');
	query.include('status');
	query.find({
		success: function(reports) {
			response.success(reports);
		},
		error: function(error) {
			response.error(error);
		}
	});
});

Parse.Cloud.define('addCategory', function(request, response) {
	var name = request.params.name;

	new Category().save({
			name: name,
			created: getTimestamp()
		}, {
			success: function(results) {
				response.success(results);
			},
			error: function(error) {
				response.error(error);
			}
	});
});

Parse.Cloud.define('addStatus', function(request, response) {
	var name = request.params.name;

	new Status().save({
		name: name,
		created: getTimestamp()
	}, {
		success: function(results) {
			response.success(results);
		},
		error: function(error) {
			response.error(error);
		}
	});
});

Parse.Cloud.define('getLatestReports', function(request, response) {
	var limit = request.params.limit || 10,
		LimitedReportCollection = Parse.Collection.extend({
			model: Report,
			query: (new Parse.Query(Report)).limit(limit)
		});
	new LimitedReportCollection().fetch({
		success: function (reports) {
			response.success(reports);
		},
		error: function(error) {
			response.error(error);
		}
	});
});

Parse.Cloud.define('getReportsPerCategory', function(request, response) {
	var days = request.params.days || 10,
		query = new Parse.Query(Report);
	query.greaterThan('createdAt', daysAgo(days));
	query.include('category');
	query.find({
		success: function(reports) {
			var aggregate = {};
			reports.forEach(function(report) {
				var categoryName = report.get('category' ).get('name');
				if (!aggregate[categoryName]) {
					aggregate[categoryName] = 0;
				}
				aggregate[categoryName] += 1;
			});
			response.success(aggregate);
		},
		error: function(error) {
			response.error(error);
		}
	});
});

Parse.Cloud.define('getReportsPerField', function(request, response) {
	var days = request.params.days || 10,
		group_name = request.params.group_name || 'locality',
		query = new Parse.Query(Report),
		fields = [
			'country',
			'locality',
		];
	query.greaterThan('createdAt', daysAgo(days));
	if (fields.indexOf(group_name) === -1) {
		response.error('Wrong field name');
	}
	query.find({
		success: function(reports) {
			var aggregate = {};
			reports.forEach(function(report) {
				var field = report.get(group_name);
				if (!aggregate[field]) {
					aggregate[field] = 0;
				}
				aggregate[field] += 1;
			});
			response.success(aggregate);
		},
		error: function(error) {
			response.error(error);
		}
	});
});


Parse.Cloud.define('getReports', function(request, response) {
	var user = request.params.user || false,
		category_id = request.params.category_id || false,
		status_id = request.params.status_id || false,
		limit = request.params.status_id || 10,
		offset = request.params.offset || 0,
		query = new Parse.Query(Report);

	if (user) {
		query.equalTo('user', user);
	}
	if (category_id) {
		query.equalTo('category_id', category_id);
	}
	if (status_id) {
		query.equalTo('status_id', status_id);
	}
	query.include('category')
	query.include('status');;
	query.skip(offset);
	query.limit(limit);
	query.find({
		success: function(reports) {
			response.success(reports);
		},
		error: function(error) {
			response.error(error);
		}
	})
});