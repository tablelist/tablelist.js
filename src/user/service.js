
angular
	.module('tl')
	.service('tl.user.service', ['tl.storage', 'tl.user.resource', 'tl.service', function(storage, User, Service){
		
		var USER_KEY = 'tl_user';

		var UserService = Service.extend(User);

		/**
		 * Returns a local copy of the current user
		 */
		UserService.prototype.currentUser = function() {
			return storage.get(USER_KEY);
		};

		/**
		 * Sets a local copy of the current user
		 */
		UserService.prototype.setCurrentUser = function(user) {
			return storage.set(USER_KEY, user);
		};

		/**
		 * Fetches the current user from the API
		 */
		UserService.prototype.me = function(success, error) {
			var _this = this;
			return User.me().$promise.then(function(user){
				_this.setCurrentUser(user);
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
				_this.setCurrentUser(user);
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
			return User.verifyPhoneNumber({}, { 
				verificationCode: code 
			}, success, error);
		};

		return new UserService();
	}]);