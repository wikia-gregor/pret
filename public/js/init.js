var appId = "6vOA5NrpkDUvKMUT5gEJXIgVNB0f6ylgvlvC2RGj";
var jsKey = "Z82RQqEFvcWFH2eRN8rAxFnK7LL4frhuu32mNQjd";

Parse.initialize( appId, jsKey );

Parse.Cloud.run( 'getNumberOfReports', { numberDays: 7 }, {
	success: function( result ) {
		console.log( result );
	},
	error: function( error ) {
		console.error( 'ERROR: ' + error.message );
	}
} );