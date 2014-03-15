$( document ).ready( function() {
	var fbLogin = $( "#fbLogin" );
	var fbLogout = $( "#fbLogout" );
	var currentUser = Parse.User.current();

	// Facebook
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

	// Getting data
	// Mocked data
	var recentReports = [
		{ geo_point: { "longitude": 20.981991, "latitude": 52.232951 }, name: "Terrible Hole", category_id: 1, status_id: 1, created: "", file_url: "http://placekitten.com/50/50", description: "Normally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I'm in a transitional period so I don't wanna kill you, I wanna help you." },
		{ geo_point: { "longitude": 20.981991, "latitude": 52.232951 }, name: "Terrible, terrible hole", category_id: 1, status_id: 1, created: "", file_url: "http://placekitten.com/50/50", description: "A terrible hole in a road" },
		{ geo_point: { "longitude": 20.981991, "latitude": 52.232951 }, name: "Goddamn Hole", category_id: 1, status_id: 1, created: "", file_url: "http://placekitten.com/50/50", description: "My money's in that office, right? If she start giving me some bullshit about it ain't there, and we got to go someplace else and get it, I'm gonna shoot you in the head then and there." },
		{ geo_point: { "longitude": 20.981991, "latitude": 52.232951 }, name: "Aweful Hole", category_id: 1, status_id: 1, created: "", file_url: "http://placekitten.com/50/50", description: "I should've known way back when... You know why, David? Because of the kids. They called me Mr Glass." },
		{ geo_point: { "longitude": 20.981991, "latitude": 52.232951 }, name: "A Hole", category_id: 1, status_id: 1, created: "", file_url: "http://placekitten.com/50/50", description: "Now that we know who you are, I know who I am. I'm not a mistake! It all makes sense! In a comic, you know how you can tell who the arch-villain's going to be? He's the exact opposite of the hero. And most times they're friends, like you and me!" },
		{ geo_point: { "longitude": 20.981991, "latitude": 52.232951 }, name: "I hate this hole", category_id: 1, status_id: 1, created: "", file_url: "http://placekitten.com/50/50", description: "But I can't give you this case, it don't belong to me." },
		{ geo_point: { "longitude": 20.981991, "latitude": 52.232951 }, name: "The Hole", category_id: 1, status_id: 1, created: "", file_url: "http://placekitten.com/50/50", description: "Now that we know who you are, I know who I am. I'm not a mistake! It all makes sense! " },
	];

	// displaying recent reports
	var recentReportsWrapper = $( "#recentReports" );
	var template = '<li><h3>{{name}}</h3><img src="{{file_url}}" /><p>{{{description}}}</p></li><br class="clear" />';
	var output = '';
	for( i in recentReports ) {
		output += Mustache.render( template, recentReports[i] );
	}
	recentReportsWrapper.html( output );
} );
