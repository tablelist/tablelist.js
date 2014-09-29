
angular
	.module('tl')
	.service('tl.auth.service', ['tl.auth.resource', 'tl.keychain', 'tl.user.service', 'tl.facebook', function(Auth, keychain, user, fb){

		var AuthService = function(){};

		/**
		 * Gets the current users auth token from the keychain
		 */
		AuthService.prototype.authToken = function() {
			return keychain.authToken();
		};

		/**
		 * Stores an auth token in the keychain
		 */
		AuthService.prototype.setAuthToken = function(token) {
			return keychain.setAuthToken(token);
		};

		/**
		 * Registers a new user
		 */
		AuthService.prototype.register = function(email, password, firstName, lastName, promo, success, error) {
			success = success || function(){};
			var _this = this;
			return Auth.register({}, {
				email: email,
				password: password,
				firstName: firstName,
				lastName: lastName,
				promo : promo
			})
			.$promise.then(function(auth){
				_this.setAuthToken(auth.token);
				user.setCurrentUser(auth.user);
				success(auth);
			}, error);
		};

		/**
		 * Logs in a user via email and password
		 */
		AuthService.prototype.login = function(email, password, success, error) {
			success = success || function(){};
			var _this = this;
			return Auth.login({}, {
				email: email,
				password: password
			})
			.$promise.then(function(auth){
				_this.setAuthToken(auth.token);
				user.setCurrentUser(auth.user);
				success(auth);
			}, error);
		};

		/**
		 * Attempts to login a user via Facebook
		 */
		AuthService.prototype.loginWithFacebook = function(success, error) {
			success = success || function(){};
			var _this = this;
			fb.login(function(err, token){
				return Auth.loginFacebook({}, {
					facebookToken: token
				})
				.$promise.then(function(auth){
					_this.setAuthToken(auth.token);
					user.setCurrentUser(auth.user);
					success(auth);
				}, error);
			});
		};

		/**
		 * Logs out the current user
		 */
		AuthService.prototype.logout = function() {
			this.setAuthToken(null);
			user.setCurrentUser(null);
			return true;
		};

		/**
		 * Sends a reset password to the given email address
		 */
		AuthService.prototype.forgotPassword = function(email, success, error) {
			return Auth.forgotPassword({}, {
				email: email
			}, success, error);
		};

		/**
		 * Resets a users password based on token recieved from forgot password email
		 */
		AuthService.prototype.resetPassword = function(token, password, success, error) {
			return Auth.resetPassword({}, {
				resetToken: token,
				password: password
			}, success, error);
		};

		return new AuthService();
	}]);