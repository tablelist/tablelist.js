angular
  .module('tl')
  .service('tl.user.service', ['$timeout', 'tl.storage', 'tl.keychain', 'tl.ee', 'tl.user.resource', 'tl.service',
    function($timeout, storage, keychain, ee, User, Service) {
      'use strict';

      var USER_KEY = 'tl_user';
      var EVENTS = {
        USER_UPDATED: 'tl.user.updated'
      };

      var UserService = Service.extend(User);

      UserService.prototype.list = function list(options) {
        if (!options) throw new Error('options is required');

        options.query = options.query ? JSON.stringify(options.query) : options.query;

        return User.list(options).$promise;
      };

      /**
       * Returns a local copy of the current user
       */
      UserService.prototype.currentUser = function() {
        return keychain.authToken() ? storage.get(USER_KEY) : null;
      };

      UserService.prototype.EVENTS = function() {
        return EVENTS;
      };

      /**
       * Sets a local copy of the current user
       */
      UserService.prototype.setCurrentUser = function(user) {
        $timeout(function() { // fire notification on next run loop
          ee.emit(EVENTS.USER_UPDATED, user);
        });
        return storage.set(USER_KEY, user);
      };

      /**
       * Merges local copy of user with new data
       */
      UserService.prototype.saveCurrentUser = function(user) {
        var _user = this.currentUser() || {};
        var keys = Object.keys(user);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var val = user[key];
          _user[key] = val;
        }
        this.setCurrentUser(_user);
      };

      /**
       * Fetches the current user from the API
       */
      UserService.prototype.me = function(success, error) {
        var _this = this;

        var promise = User.me().$promise;

        promise.then(function(user) {
          _this.saveCurrentUser(user);
          if (success) {
            success(user);
          }
        }, error);

        return promise;
      };

      /**
       * Updates the current user
       */
      UserService.prototype.updateMe = function(body, success, error) {
        var _this = this;
        return User.updateMe({}, body).$promise.then(function(user) {
          _this.saveCurrentUser(user);
          if (success) {
            success(user);
          }
        }, error);
      };

      /**
       * Sets the users preferred city
       */
      UserService.prototype.updatePreferredCity = function(cityId, success, error) {
        var _this = this;
        var body = {
          city: cityId
        };
        return User.updatePreferredCity({}, body).$promise.then(function(user) {
          _this.saveCurrentUser(user);
          if (success) {
            success(user);
          }
        }, error);
      };

      /**
       * Requests a verification code to verify a phone number
       */
      UserService.prototype.requestVerificationCode = function(id, success, error) {
        return User.requestVerificationCode({
          id: id
        }, success, error);
      };

      /**
       * Requests a verification code to verify a phone number
       */
      UserService.prototype.requestVerificationCodeForCurrentUser = function(success, error) {
        return User.requestVerificationCodeForCurrentUser({}, success, error);
      };

      /**
       * Verifies the users phone number
       */
      UserService.prototype.verifyPhoneNumber = function(id, code, success, error) {
        var _this = this;
        var data = {
          id: id,
          verificationCode: code
        };
        return User.verifyPhoneNumber({}, data).$promise.then(function(user) {
          _this.saveCurrentUser(user);
          if (success) {
            success(user);
          }
          return user;
        }, error);
      };

      /**
       * Verifies the users phone number
       */
      UserService.prototype.verifyPhoneNumberForCurrentUser = function(code, success, error) {
        var _this = this;
        var data = {
          verificationCode: code
        };
        return User.verifyPhoneNumber({}, data).$promise.then(function(user) {
          _this.saveCurrentUser(user);
          if (success) {
            success(user);
          }
          return user;
        }, error);
      };

      /**
       * Lists a user's payment profiles
       */
      UserService.prototype.listPaymentProfiles = function(userId, success, error) {
        return User.listPaymentProfiles({
          id: userId
        }, success, error);
      };

      /**
       * Lists a user's referrals
       */
      UserService.prototype.listReferrals = function(userId, success, error) {
        return User.listReferrals({
          id: userId
        }, success, error);
      };

      /**
       * Lists a user's bookings
       */
      UserService.prototype.listBookings = function(options) {
        if (!options) throw new Error('options is required');
        if (!options.id) throw new Error('options.id is required');

        return User.listBookings(options).$promise;
      };

      /**
       * Lists a user's promos
       */
      UserService.prototype.listPromos = function(userId, success, error) {
        return User.listPromos({
          id: userId
        }, success, error);
      };

      /**
       * Lists a user's tasks
       */
      UserService.prototype.listTasks = function(userId, success, error) {
        return User.listTasks({
          id: userId
        }, success, error);
      };

      /**
       * Lists a user's notifications
       */
      UserService.prototype.listNotifications = function(userId, success, error) {
        return User.listNotifications({
          id: userId
        }, success, error);
      };

      /**
       * Lists a user's unanswered questions
       */
      UserService.prototype.listQuestions = function(userId, type, success, error) {
        return User.listQuestions({
          id: userId,
          type: type
        }, success, error);
      };

      /**
       * Lists a user's answers
       */
      UserService.prototype.listAnswers = function(userId, success, error) {
        return User.listAnswers({
          id: userId
        }, success, error);
      };

      /**
       * Returns an array of high priority users
       */
      UserService.prototype.listHighPriority = function(hours, priority, cityId, success, error) {
        return User.listHighPriority({
          hours: hours || 24,
          priority: priority || 7,
          city: cityId
        }, success, error);
      };

      /**
       * Add credit for a user
       */
      UserService.prototype.addCredit = function(userId, amount, campaignId, success, error) {
        return User.addCredit({
          id: userId
        }, {
          amount: amount,
          campaign: campaignId
        }, success, error);
      };

      /**
       * Add a subscription for a user
       *
       * @method addSubscription
       * @param {Object} options
       * @param {String} [options.userId] - user to subscribe
       * @param {String} [options.planId] - braintree reoccurring plan
       * @param {String} [options.paymentProfileId] - payment profile to charge
       */
      UserService.prototype.addSubscription = function(options, success, error) {
        if (!options) throw new Error('options is required');
        if (!options.userId) throw new Error('options.userId is required');
        if (!options.planId) throw new Error('options.planId is required');
        if (!options.paymentProfileId) throw new Error('options.paymentProfileId is required');

        return User.addSubscription({
          id: options.userId
        }, options, success, error);
      };

      /**
       * Remove a subscription for a user
       */
      UserService.prototype.removeSubscription = function(userId, success, error) {
        return User.removeSubscription({
          id: userId
        }, success, error);
      };

      /**
       * Find a user's name and photo by their referral code
       */
      UserService.prototype.findByReferral = function(code, success, error) {
        return User.findByReferral({
          code: code
        }, success, error);
      };
      /**
       * Get a user's referral stats
       */
      UserService.prototype.getReferralStats = function(userId, success, error) {
        return User.getReferralStats({
          id: userId
        }, success, error);
      };

      /**
       * Get a user's referral stats
       */
      UserService.prototype.search = function(options) {
        if (!options) throw new Error('options is required');
        if (!options.query) throw new Error('options.query is required');

        return User.search(options).$promise;
      };

      /**
       * Lists a user's venues
       */
      UserService.prototype.listVenues = function(options) {
        if (!options) throw new Error('options is required');
        if (!options.userId) throw new Error('options.userId is required');

        options.id = options.userId;
        delete options.userId;

        return User.listVenues(options).$promise;
      };

      UserService.prototype.favorite = function(options) {
        if (!options) throw new Error('options is required');
        if (!options.userId) throw new Error('options.userId is required');

        var userId = options.userId;
        delete options.userId;

        return User.favorite({
          id: userId
        }, options).$promise;
      };

      UserService.prototype.unfavorite = function(options) {
        if (!options) throw new Error('options is required');
        if (!options.userId) throw new Error('options.userId is required');
        if (!options.favoriteId) throw new Error('options.favoriteId is required');

        var userId = options.userId;
        delete options.userId;
        var favoriteId = options.favoriteId;
        delete options.favoriteId;

        return User.unfavorite({
          id: userId,
          favoriteId: favoriteId
        }, options).$promise;
      };

      UserService.prototype.listFavorites = function(options) {
        if (!options) throw new Error('options is required');
        if (!options.userId) throw new Error('options.userId is required');

        options.id = options.userId;
        delete options.userId;

        return User.listFavorites(options).$promise;
      };

      UserService.prototype.listReviews = function(options) {
        if (!options) throw new Error('options is required');
        if (!options.userId) throw new Error('options.userId is required');

        options.id = options.userId;
        delete options.userId;

        return User.listReviews(options).$promise;
      };

      UserService.prototype.markAffiliate = function(userId, options) {
        if (!userId) throw new Error('userId is required');
        if (!options) throw new Error('options is required');
        if (!options.name) throw new Error('options.name is required');

        return User.markAffiliate({
          id: userId
        }, options).$promise;
      };

      UserService.prototype.listAffiliates = function(options) {
        if (!options) throw new Error('options is required');
        if (!options.userId) throw new Error('options.userId is required');

        options.id = options.userId;
        delete options.userId;

        return User.listAffiliates(options).$promise;
      };

      UserService.prototype.listStats = function(options) {
        if (!options) throw new Error('options is required');
        if (!options.userId) throw new Error('options.userId is required');

        options.id = options.userId;
        delete options.userId;

        return User.listStats(options).$promise;
      };

      UserService.prototype.access = function access(options) {
        if (!options) throw new Error('options is required');
        if (!options.userId) throw new Error('options.userId is required');

        options.id = options.userId;
        delete options.userId;

        return User.access(options).$promise;
      };

      return new UserService();
    }
  ]);
