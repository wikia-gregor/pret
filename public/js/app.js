$( document ).ready( function() {
	var fbLogin = $( "#fbLogin" );
	var fbLogout = $( "#fbLogout" );
	var currentUser = Parse.User.current();

	// Facebook
	/*
	$.getScript( '//connect.facebook.net/en_UK/all.js', function() {
		Parse.FacebookUtils.init( {
			appId      : config.fb.appId,
			status     : true,
			cookie     : true,
			xfbml      : true
		} );

		if( currentUser && Parse.FacebookUtils.isLinked( currentUser ) ) {
			fbLogout.show();
		} else {
			fbLogin.show();

			fbLogin.click( function() {
				Parse.FacebookUtils.logIn( 'basic_info', {
					success: function( user ) {
						fbLogin.hide();
						fbLogout.show();
					},
					error: function( user, error ) {
						console.error( "User cancelled the Facebook login or did not fully authorize." );
					}
				} );
			} );
		}

		fbLogout.click( function() {
			Parse.User.logOut();
			fbLogout.hide();
			fbLogin.show();
		} );
	} );
	*/

	// Getting & displaying latest reports
	Parse.Cloud.run( 'getLatestReports', {}, {
		success: function( result ) {
			var recentReports = result.models;
			var recentReportsWrapper = $( "#recentReports" );
			var template = '<li><h3>{{name}}</h3><img src="{{file_url}}" /><p>{{{description}}}</p></li><br class="clear" />';
			var output = '';

			for( i in recentReports ) {
				var report = recentReports[i];
				output += Mustache.render( template, {
					name: report.get( 'name' ),
					file_url: report.get( 'file_url' ),
					description: report.get( 'description' )
				} );
			}

			recentReportsWrapper.html( output );
		},
		error: function( error ) {
			console.error( 'Could not get latest reports (' + error.message + ')' );
		}
	});

	$( "nav a" ).click( function( event ) {
		event.preventDefault();
		var full_url = this.href;
		var parts = full_url.split("#");
		var trgt = parts[1];
		var target_offset = $("#"+trgt).offset();
		var target_top = target_offset.top;

		$( "html, body" ).animate( { scrollTop: target_top }, 500 );
	});
} );
