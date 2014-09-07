
angular
	.module('test', ['tl'])
	.controller('TestController', 
		[// Lib
		 'tl.cookie', 'tl.facebook', 'tl.http', 'tl.utils', 'tl.ee',
		 'tl.keychain', 'tl.query', 'tl.storage', 'tl.session', 'tl.ws',
		 
		 // Modules
		 'tl.auth', 'tl.user', 'tl.booking', 'tl.venue', 
		 'tl.city', 'tl.settings', 'tl.review', 'tl.reward', 
		 'tl.table', 'tl.event', 'tl.item', 'tl.track', 'tl.prospect',
		 'tl.inquiry', 'tl.inventory', 'tl.schedule', 'tl.payment',

		function(
			// Lib
			cookie, facebook, http, utils, ee,
			keychain, query, storage, session, ws,
			// Modules
			auth, user, booking, venue, 
			city, settings, review, reward, 
			table, event, item, track, prospect,
			inquiry, inventory, schedule, payment){	
				
				// Lib
				tlCookie = cookie;
				tlFacebook = facebook;
				tlHTTP = http;
				tlKeychain = keychain;
				tlQuery = query;
				tlStorage = storage;
				tlSession = session;
				tlWS = ws;
				tlUtils = utils;
				tlEventEmitter = ee;

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
				tlProspect = prospect;
				tlPayment = payment;

				// clear previous tests
				tlAuth.service.logout();

				// Run Tests
				mocha.checkLeaks();
				mocha.run();
			}]);