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
	response.error('NOT IMPLEMENTED');
});

Parse.Cloud.define('addReportUpdate', function(request, response) {
	response.error('NOT IMPLEMENTED');
});

Parse.Cloud.define('getReport', function(request, response) {
	response.error('NOT IMPLEMENTED');
});

Parse.Cloud.define('getNearestReports', function(request, response) {
	response.error('NOT IMPLEMENTED');
});
