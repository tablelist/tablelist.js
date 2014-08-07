
angular
	.module('test', ['tl'])
	.controller('TestController', 
		['$scope', 
		 // Lib
		 'tl.cookie', 'tl.facebook', 'tl.http', 'tl.keychain', 'tl.query', 'tl.storage', 'tl.ws',
		 // Common
		 'tl.resource', 'tl.service',
		 // Resource
		 'tl.user.resource', 'tl.booking.resource', 'tl.venue.resource', 'tl.city.resource',
		 // Services
		 'tl.auth', 'tl.user', 'tl.booking', 'tl.venue', 'tl.city',

		function($scope,
			// Lib
			cookie, facebook, http, keychain, query, storage, ws,
			// Common
			resource, service,
			// Resources
			user, booking, venue, city,
			// Services
			authService, userService, bookingService, venueService, cityService){
				
				// Lib
				tlCookie = cookie;
				tlFacebook = facebook;
				tlHTTP = http;
				tlKeychain = keychain;
				tlQuery = query;
				tlStorage = storage;
				tlWS = ws;

				// Common
				tlResource = resource;
				tlService = service;

				// Resources
				tlUser = user;
				tlBooking = booking;
				tlVenue = venue;
				tlCity = city;

				// Services
				tlAuthService = authService;
				tlUserService = userService;
				tlBookingService = bookingService;
				tlVenueService = venueService;
				tlCityService = cityService;

				// Run Tests
				tlAuthService.logout();
				mocha.checkLeaks();
				mocha.run();
			}]);