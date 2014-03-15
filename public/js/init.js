Parse.initialize( appId, jsKey );

Parse.Cloud.run( 'getNumberOfReports', { numberDays: 7 }, {
	success: function( result ) {
		console.log( result );
	},
	error: function( error ) {
		console.error( 'ERROR: ' + error.message );
	}
} );