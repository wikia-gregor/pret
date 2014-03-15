function getTimestamp(){
	return new Date().getTime();
}

// Get list of categories
Parse.Cloud.define('getCategories', function(request, response) {
	var Category = Parse.Object.extend('Category');
	var CategoryCollection = Parse.Collection.extend({
		model: Category
	});
	var collection = new CategoryCollection();

	collection.fetch({
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
	var Status = Parse.Object.extend('Status');
	var StatusCollection = Parse.Collection.extend({
		model: Status
	});
	var collection = new StatusCollection();

	collection.fetch({
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
		status_id = request.params.status_id || null;

	var Report = Parse.Object.extend('Report'),
		query = new Parse.Query(Report);
	if ( status_id ) {
		query.equalTo('status_id', status_id);
	}
	var dateFilter = new Date().getTime() - (86400000 * days)
	query.greaterThan('created', dateFilter);
	query.count({
		success: function(count) {
			response.success(count);
		},
		error: function(error) {
			response.error(error);
		}
	})
});

Parse.Cloud.define('addReport', function(request, response) {
	var geo_point = request.params.geo_point,
		name = request.params.name,
		category_id = request.params.category_id,
		status_id = request.params.status_id,
		description = request.params.status_id,
		file_url = request.params.file_url,
		Report = Parse.Object.extend('Report'),
		ReportUpdate = Parse.Object.extend('ReportUpdate'),
		report = new Report(),
		now = getTimestamp();

	report.save({
		geoPoint: geo_point,
		name: name,
		category_id: category_id,
		status_id: status_id,
		description: description,
		file_url: file_url,
		created: now
	}, {
		success: function(report) {
			var reportUpdate = new ReportUpdate();
			reportUpdate.save({
				user: Parse.User.current(),
				description: description,
				place_id: report.id,
				file_url: file_url,
				status_id: status_id,
				created: now
			}, {
				success: function(reportUpdate) {
					report.updates = [reportUpdate];
					response.success(report);
				}
			})
		},
		error: function(error) {
			response.error(error);
		}
	})
});

Parse.Cloud.define('addReportUpdate', function(request, response) {
	var report_id = request.params.report_id || null,
		description = request.params.description || '',
		status_id = request.params.status_id,
		file_url = request.params.file_url
		ReportUpdate = Parse.Object.extend('ReportUpdate'),
		reportUpdate = new ReportUpdate();
	// TODO: validate data
	reportUpdate.save({
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
		Report = ParseObject.extend('Report'),
		ReportUpdate = Parse.Object.extend('ReportUpdate'),
		ReportUpdateCollection = Parse.Collection.extend({
			model: ReportUpdate
		}),
		report = new Report(),
		query = new Parse.Query(Report);
	query.equalTo('id', report_id);
	query.first({
		success: function (report) {
			var reportUpdateCollection = new ReportUpdateCollection();
			query = new Parse.Query(ReportUpdate);
			query.equalTo('report_id', report_id);
			reportUpdateCollection = query.collection();
			report.updates = reportUpdateCollection;
			response.success(report);
		},
		error: function(error) {
			response.error(error);
		}
	});
});

Parse.Cloud.define('getNearestReports', function(request, response) {
	response.error('NOT IMPLEMENTED');
});
