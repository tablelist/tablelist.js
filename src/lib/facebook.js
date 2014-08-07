
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

		return new Facebook();
	}]);