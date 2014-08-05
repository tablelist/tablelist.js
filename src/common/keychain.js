
angular
	.module('tl')
	.factory('tl.keychain', ['tl.storage', 'tl.cookie', function(storage, cookie){

		var AUTH_KEY = 'tl_auth';
		
		var Keychain = function(){};

		Keychain.prototype.authToken = function() {
			return cookie.get(AUTH_KEY);
		};

		Keychain.prototype.setAuthToken = function(token) {
			return cookie.set(AUTH_KEY, token);
		};

		return new Keychain();
	}]);