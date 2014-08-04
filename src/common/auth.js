
var AUTH_KEY = 'tl_auth'
  , USER_KEY = 'tl_user';

angular
	.module('tl')
	.factory('auth', ['storage', 'cookie', function(Storage, Cookie){

		var Auth = function(){};

		Auth.prototype.authToken = function() {
			return Cookie.get(AUTH_KEY);
		};

		Auth.prototype.setAuthToken = function(token) {
			return Cookie.set(AUTH_KEY, token);
		};	

		Auth.prototype.currentUser = function() {
			return Storage.get(USER_KEY);
		};

		Auth.prototype.setCurrentUser = function(user) {
			return Storage.set(USER_KEY, user);
		};

		return new Auth();
	}]);