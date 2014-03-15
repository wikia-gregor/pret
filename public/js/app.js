$( document ).ready( function() {
	var fbLogin = $( "#fbLogin" );
	var fbLogout = $( "#fbLogout" );
	var currentUser = Parse.User.current();

	// Facebook
	$.getScript( '//connect.facebook.net/en_UK/all.js', function() {
		console.log( 'Getting FB SDK...' );

		Parse.FacebookUtils.init( {
			appId      : config.fb.appId,
			status     : true,
			cookie     : true,
			xfbml      : true
		} );

		console.log( 'Getting FB SDK...' );
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

} );
