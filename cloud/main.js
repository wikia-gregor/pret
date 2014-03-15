// TODO: validate data

function getTimestamp(){
	return new Date().getTime();
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
		query = new Parse.Query(Report);

	if ( status_id ) {
		query.equalTo('status_id', status_id);
	}
	var dateFilter = getTimestamp() - (86400000 * days);
	query.greaterThan('created', dateFilter);
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
		description = request.params.status_id,
		file_url = request.params.file_url,
		category = new Category(),
		status = new Status(),
		now = getTimestamp();

	category.id = category_id;
	status.id = status_id;

	new Report().save({
		geo_point: geo_point,
		name: name,
		category_id: category_id,
		category: category,
		status_id: status_id,
		status: status,
		description: description,
		file_url: file_url,
		created: now
	}, {
		success: function(report) {
			var reportUpdate = new ReportUpdate();
			reportUpdate.save({
				geo_point: geo_point,
				user: Parse.User.current(),
				description: description,
				report_id: report.id,
				report: report,
				file_url: file_url,
				status_id: status_id,
				status: status,
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

Parse.Cloud.define('addReportUpdate', function(request, response) {
	var report_id = request.params.report_id || null,
		description = request.params.description || '',
		status_id = request.params.status_id,
		file_url = request.params.file_url;

	new ReportUpdate().save({
		report_id: report_id,
		description: description,
		status_id: status_id,
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
		query = new Parse.Query(Report),
		dateFilter = getTimestamp - (86400000 * days);
	query.greaterThan('created', dateFilter);
	query.find({
		success: function(reports) {
			var aggregate = {};
			reports.forEach(function(report) {
				if (!aggregate[report.category.name]) {
					aggregate[report.category.name] = 0;
				}
				aggregate[report.category.name] += 1;
			});
			response.success(aggregate);
		},
		error: function(error) {
			response.error(error);
		}
	});
});