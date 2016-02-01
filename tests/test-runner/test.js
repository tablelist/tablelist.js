angular
  .module('test', ['tl'])
  .controller('TestController', [ // Lib
    'tl.cookie', 'tl.facebook', 'tl.http', 'tl.utils', 'tl.ee',
    'tl.keychain', 'tl.query', 'tl.storage', 'tl.session', 'tl.socket',

    // Modules
    'tl.auth', 'tl.user', 'tl.booking', 'tl.venue',
    'tl.city', 'tl.client', 'tl.settings', 'tl.review', 'tl.reward',
    'tl.table', 'tl.event', 'tl.item', 'tl.track', 'tl.prospect',
    'tl.inquiry', 'tl.inventory', 'tl.schedule', 'tl.payment',
    'tl.affiliate',

    function(
      // Lib
      cookie, facebook, http, utils, ee,
      keychain, query, storage, session, ws,
      // Modules
      auth, user, booking, venue,
      city, settings, review, reward,
      table, event, item, track, prospect,
      inquiry, inventory, schedule, payment, affiliate) {

      // Lib
      window.tlCookie = cookie;
      window.tlFacebook = facebook;
      window.tlHTTP = http;
      window.tlKeychain = keychain;
      window.tlQuery = query;
      window.tlStorage = storage;
      window.tlSession = session;
      window.tlWS = ws;
      window.tlUtils = utils;
      window.tlEventEmitter = ee;

      // Modules
      window.tlAuth = auth;
      window.tlUser = user;
      window.tlBooking = booking;
      window.tlVenue = venue;
      window.tlCity = city;
      window.tlClient = client;
      window.tlSettings = settings;
      window.tlReview = review;
      window.tlReward = reward;
      window.tlTable = table;
      window.tlEvent = event;
      window.tlItem = item;
      window.tlTrack = track;
      window.tlInquiry = inquiry;
      window.tlInventory = inventory;
      window.tlSchedule = schedule;
      window.tlProspect = prospect;
      window.tlPayment = payment;
      window.tlAffiliate = affiliate;

      // clear previous tests
      window.tlAuth.service.logout();

      // Run Tests
      mocha.checkLeaks();
      mocha.run();
    }
  ]);
