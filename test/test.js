
angular
	.module('test', ['tl'])
	.controller('TestController', 
		[// Lib
		 'tl.cookie', 'tl.facebook', 'tl.http', 'tl.utils',
		 'tl.keychain', 'tl.query', 'tl.storage', 'tl.ws',
		 
		 // Modules
		 'tl.auth', 'tl.user', 'tl.booking', 'tl.venue', 
		 'tl.city', 'tl.settings', 'tl.review', 'tl.reward', 
		 'tl.table', 'tl.event', 'tl.item', 'tl.track',
		 'tl.inquiry', 'tl.inventory', 'tl.schedule',

		function(
			// Lib
			cookie, facebook, http, utils,
			keychain, query, storage, ws,
			// Modules
			auth, user, booking, venue, 
			city, settings, review, reward, 
			table, event, item, track,
			inquiry, inventory, schedule){	
				
				// Lib
				tlCookie = cookie;
				tlFacebook = facebook;
				tlHTTP = http;
				tlKeychain = keychain;
				tlQuery = query;
				tlStorage = storage;
				tlWS = ws;
				tlUtils = utils;

				// Modules
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
				tlTrack = track;
				tlInquiry = inquiry;
				tlInventory = inventory;
				tlSchedule = schedule;

				// clear previous tests
				tlAuth.service.logout();

				// Run Tests
				mocha.checkLeaks();
				mocha.run();
			}]);