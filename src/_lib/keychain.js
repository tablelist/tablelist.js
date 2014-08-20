
angular
	.module('tl')
	.factory('tl.keychain', ['tl.cookie', 'tl.utils', function(cookie, utils){

		var AUTH_KEY = 'tl_auth';
		var PROSPECT_KEY = 'tl_prospect';
		
		var Keychain = function(){};

		Keychain.prototype.authToken = function() {
			return cookie.get(AUTH_KEY);
		};

		Keychain.prototype.setAuthToken = function(token) {
			return cookie.set(AUTH_KEY, token);
		};

		Keychain.prototype.prospectToken = function() {
			var token = cookie.get(PROSPECT_KEY);
			if (!token) {
				token = utils.guid(16, '-');
				this.setProspectToken(token);
			}
			return token;
		};

		Keychain.prototype.setProspectToken = function(token) {
			return cookie.set(PROSPECT_KEY, token);
		};

		return new Keychain();
	}]);