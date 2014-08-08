
angular
	.module('test', ['tl'])
	.controller('TestController', 
		['$scope', 
		 // Lib
		 'tl.cookie', 'tl.facebook', 'tl.http', 'tl.keychain', 'tl.query', 'tl.storage', 'tl.ws',
		 // Modules
		 'tl.auth', 'tl.user', 'tl.booking', 'tl.venue', 'tl.city', 'tl.settings', 'tl.review', 'tl.reward', 'tl.table', 'tl.event', 'tl.item',

		function($scope,
			// Lib
			cookie, facebook, http, keychain, query, storage, ws,
			// Modules
			auth, user, booking, venue, city, settings, review, reward, table, event, item){
				
				// Lib
				tlCookie = cookie;
				tlFacebook = facebook;
				tlHTTP = http;
				tlKeychain = keychain;
				tlQuery = query;
				tlStorage = storage;
				tlWS = ws;

				// Resources
				tlAuth = auth;
				tlUser = user;
				tlBooking = booking;
				tlVenue = venue;
				tlCity = city;
				tlSettings = settings;
				tlReview = review;
				tlReward = reward;
				tlTable = table;
				tlEvent = event;
				tlItem = item;

				// clear previous tests
				tlAuth.service.logout();

				// Run Tests
				mocha.checkLeaks();
				mocha.run();
			}]);