
angular
	.module('tl')
	.factory('tl.facebook', ['tl.config', function(config){

		var PERMISSIONS = [ 'public_profile', 'email', 'user_friends' ];

		var Facebook = function(){};

		Facebook.prototype.login = function(next) {
			FB.login(function(response){
				if (response && response.authResponse) {
					var accessToken = response.authResponse.accessToken;
	                next(null, accessToken);
				} else {
					next(response);
				}
			}, { scope: PERMISSIONS });
		};

		Facebook.prototype.events = function() {
			return window.FB ? FB.AppEvents.EventNames : {};
		};

		Facebook.prototype.logEvent = function() {
			if (!config.ENV_PROD) {
				console.log('FB ' + arguments[0] + ' - [ ' + arguments.splice(1).join(', ')) + ' ]';
				return false;
			}
			return FB.AppEvents.logEvent.apply(this, arguments);
		};

		Facebook.prototype.logPurchase = function() {
			if (!config.ENV_PROD) {
				console.log('FB Purchase - [ ' + arguments.join(', ')) + ' ]';
				return false;
			}
			return FB.AppEvents.logPurchase.apply(this, arguments);
		};

		return new Facebook();
	}]);