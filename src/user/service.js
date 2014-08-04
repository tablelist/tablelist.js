
angular
	.module('tl')
	.factory('tl.user', ['tl.storage', 'tl.auth', function(storage, auth){
		
		var USER_KEY = 'tl_user';

		var User = function(){};

		User.prototype.currentUser = function() {
			return storage.get(USER_KEY);
		};

		User.prototype.setCurrentUser = function(user) {
			return storage.set(USER_KEY, user);
		};

		return new User();
	}]);