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
      UserService.prototype.listBookings = function(userId, success, error) {
        return User.listBookings({
          id: userId
        }, success, error);
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
       * Returns an array of a users venues (staff)
       */
      UserService.prototype.listVenues = function(listVenues, success, error) {
        return User.listVenues({
          listVenues: listVenues
        }, success, error);
      };

      UserService.prototype.addCredit = function(userId, amount, campaignId, success, error) {
        var _this = this;
        return User.addCredit({
          id: userId
        }, {
          amount: amount,
          campaign: campaignId
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

      return new UserService();
    }
  ]);
