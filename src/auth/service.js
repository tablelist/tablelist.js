
angular
	.module('tl')
	.factory('tl.auth', ['tl.storage', 'tl.cookie', function(storage, cookie){

		var AUTH_KEY = 'tl_auth';

		var Auth = function(){};

		Auth.prototype.authToken = function() {
			return cookie.get(AUTH_KEY);
		};

		Auth.prototype.setAuthToken = function(token) {
			return cookie.set(AUTH_KEY, token);
		};

		Auth.prototype.login = function(email, password) {
			// todo
		};

		Auth.prototype.loginWithFacebook = function() {
			// todo
		};

		Auth.prototype.logout = function() {
			// todo
		};

		return new Auth();
	}]);