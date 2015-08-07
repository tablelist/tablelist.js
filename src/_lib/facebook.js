
angular
	.module('tl')
	.factory('tl.facebook', ['tl.config', function(config){

		var PERMISSIONS = [ 'public_profile', 'email', 'user_friends' ];

		var Facebook = function(){};

		Facebook.prototype.login = function(next) {
			try {
				return FB.login(function(response){
					if (response && response.authResponse) {
						var accessToken = response.authResponse.accessToken;
		                next(null, accessToken);
					} else {
						next(response);
					}
				}, { scope: PERMISSIONS });
			} catch(err) {
				return false;
			}
		};

		Facebook.prototype.events = function() {
			try {
				return FB.AppEvents.EventNames;
			} catch(err) {
				return {};
			}
		};

		Facebook.prototype.logEvent = function() {
			if (!config.ENV_PROD) return;

			try {
				return FB.AppEvents.logEvent.apply(this, arguments);
			} catch(err) {
				return false;
			}
		};

		Facebook.prototype.logPurchase = function() {
			if (!config.ENV_PROD) return;

			try {
				return FB.AppEvents.logPurchase.apply(this, arguments);
			} catch(err) {
				return false;
			}
		};

		return new Facebook();
	}]);
