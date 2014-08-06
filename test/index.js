
angular
	.module('test', ['tl'])
	.controller('TestController', 
		['$scope', 
		 // Lib
		 'tl.cookie', 'tl.facebook', 'tl.http', 'tl.keychain', 'tl.query', 'tl.storage',
		 // Common
		 'tl.resource', 'tl.service',
		 // Resource
		 'tl.user.resource',
		 // Services
		 'tl.auth', 'tl.user',

		function($scope,
			// Lib
			cookie, facebook, http, keychain, query, storage,
			// Common
			resource, service,
			// Resources
			user,
			// Services
			authService, userService){
		
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

				// Services
				tlAuthService = authService;
				tlUserService = userService;

				// Run Tests
				tlAuthService.logout();
				mocha.timeout(5 * 1000);
				mocha.checkLeaks();
				mocha.run();
		}]);