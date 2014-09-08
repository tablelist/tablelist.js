
angular
	.module('tl')
	.service('tl.user.service', ['$timeout', 'tl.storage', 'tl.keychain', 'tl.ee', 'tl.user.resource', 'tl.service', function($timeout, storage, keychain, ee, User, Service){
		
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
			$timeout(function(){ // fire notification on next run loop
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
			return User.me().$promise.then(function(user){
				_this.saveCurrentUser(user);
				if (success) {
					success(user);
				}
			}, error);
		};

		/**
		 * Updates the current user
		 */
		UserService.prototype.updateMe = function(body, success, error) {
			var _this = this;
			return User.updateMe({}, body).$promise.then(function(user){
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
			var body = { city: cityId };
			return User.updatePreferredCity({}, body).$promise.then(function(user){
				_this.saveCurrentUser(user);
				if (success) {
					success(user);
				}
			}, error);
		};

		/**
		 * Requests a verification code to verify a phone number
		 */
		UserService.prototype.requestVerificationCode = function(success, error) {
			return User.requestVerificationCode({}, success, error);
		};

		/**
		 * Verifies the users phone number
		 */
		UserService.prototype.verifyPhoneNumber = function(code, success, error) {
			var _this = this;
			var data = { verificationCode: code };
			return User.verifyPhoneNumber({}, data).$promise.then(function(user){
				_this.saveCurrentUser(user);
				if (success) {
					success(user);
				}
			}, error);
		};

		return new UserService();
	}]);