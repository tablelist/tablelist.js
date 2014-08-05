
angular
	.module('tl')
	.factory('tl.user', ['tl.storage', 'tl.auth', 'tl.user.resource', function(storage, auth, User){
		
		var USER_KEY = 'tl_user';

		var User = function(){};

		User.prototype.currentUser = function() {
			return storage.get(USER_KEY);
		};

		User.prototype.setCurrentUser = function(user) {
			return storage.set(USER_KEY, user);
		};

		User.prototype.me = function(next) {
			next = next || function(){};
			return User.me().success(function(user){
				next(null, user);
			}).error(next);
		};

		return new User();
	}]);