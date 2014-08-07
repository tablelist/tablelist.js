
angular
	.module('test', ['tl'])
	.controller('TestController', 
		['$scope', 
		 // Lib
		 'tl.cookie', 'tl.facebook', 'tl.http', 'tl.keychain', 'tl.query', 'tl.storage', 'tl.ws',
		 // Common
		 'tl.resource', 'tl.service',
		 // Resource
		 'tl.auth.resource', 'tl.user.resource', 'tl.booking.resource', 'tl.venue.resource', 'tl.city.resource', 'tl.settings.resource',
		 // Services
		 'tl.auth', 'tl.user', 'tl.booking', 'tl.venue', 'tl.city', 'tl.settings',

		function($scope,
			// Lib
			cookie, facebook, http, keychain, query, storage, ws,
			// Common
			resource, service,
			// Resources
			auth, user, booking, venue, city, settings,
			// Services
			authService, userService, bookingService, venueService, cityService, settingsService){
				
				// Lib
				tlCookie = cookie;
				tlFacebook = facebook;
				tlHTTP = http;
				tlKeychain = keychain;
				tlQuery = query;
				tlStorage = storage;
				tlWS = ws;

				// Common
				tlAuth = auth;
				tlResource = resource;
				tlService = service;

				// Resources
				tlUser = user;
				tlBooking = booking;
				tlVenue = venue;
				tlCity = city;
				tlSettings = settings;

				// Services
				tlAuthService = authService;
				tlUserService = userService;
				tlBookingService = bookingService;
				tlVenueService = venueService;
				tlCityService = cityService;
				tlSettingsService = settingsService;

				// clear previous tests
				tlAuthService.logout();

				// Run Tests
				mocha.checkLeaks();
				mocha.run();
			}]);