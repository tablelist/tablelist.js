
angular
	.module('tl')
	.service('tl.auth.service', ['tl.auth.resource', 'tl.keychain', 'tl.user.service', 'tl.facebook', function(Auth, keychain, user, fb){

		var AuthService = function(){};

		AuthService.prototype.authToken = function() {
			return keychain.authToken();
		};

		AuthService.prototype.setAuthToken = function(token) {
			return keychain.setAuthToken(token);
		};

		AuthService.prototype.register = function(email, password, firstName, lastName, success, error) {
			var _this = this;
			return Auth.register({}, {
				email: email,
				password: password,
				firstName: firstName,
				lastName: lastName
			}, success, error)
			.$promise.then(function(auth){
				_this.setAuthToken(auth.token);
				user.setCurrentUser(auth.user);
			});
		};

		AuthService.prototype.login = function(email, password, success, error) {
			var _this = this;
			return Auth.login({}, {
				email: email,
				password: password
			}, success, error)
			.$promise.then(function(auth){
				_this.setAuthToken(auth.token);
				user.setCurrentUser(auth.user);
			});
		};

		AuthService.prototype.loginWithFacebook = function(success, error) {
			var _this = this;
			fb.login(function(err, token){
				var _this = this;
				return Auth.loginFacebook({}, {
					facebookToken: token
				}, success, error)
				.$promise.then(function(auth){
					_this.setAuthToken(auth.token);
					user.setCurrentUser(auth.user);
				});
			});
		};

		AuthService.prototype.logout = function() {
			this.setAuthToken(null);
			user.setCurrentUser(null);
			return true;
		};

		AuthService.prototype.forgotPassword = function(email, success, error) {
			return Auth.forgotPassword({}, {
				email: email
			}, success, error);
		};

		AuthService.prototype.resetPassword = function(token, password, success, error) {
			return Auth.resetPassword({}, {
				email: email,
				password: password
			}, success, error);
		};

		return new AuthService();
	}]);