
angular
	.module('test', ['tl'])
	.controller('TestController', 
		['$scope', 
		 // Lib
		 'tl.cookie', 'tl.facebook', 'tl.http', 'tl.keychain', 'tl.query', 'tl.storage',
		 // Common
		 'tl.resource', 'tl.service',
		 // Resource
		 'tl.user.resource', 'tl.booking.resource',
		 // Services
		 'tl.auth', 'tl.user', 'tl.booking',

		function($scope,
			// Lib
			cookie, facebook, http, keychain, query, storage,
			// Common
			resource, service,
			// Resources
			user, booking,
			// Services
			authService, userService, bookingService){
		
				// Lib
				tlCookie = cookie;
				tlFacebook = facebook;
				tlHTTP = http;
				tlKeychain = keychain;
				tlQuery = query;
				tlStorage = storage;

				// Common
				tlResource = resource;
				tlService = service;

				// Resources
				tlUser = user;
				tlBooking = booking;

				// Services
				tlAuthService = authService;
				tlUserService = userService;
				tlBookingService = bookingService;

				// Run Tests
				tlAuthService.logout();
				mocha.checkLeaks();
				mocha.run();
		}]);