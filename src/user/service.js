
angular
	.module('tl')
	.factory('tl.user', ['tl.storage', 'tl.auth', 'tl.user.resource', 'tl.service', function(storage, auth, User, Service){
		
		var USER_KEY = 'tl_user';

		var UserService = Service.extend(User);

		UserService.prototype.currentUser = function() {
			return storage.get(USER_KEY);
		};

		UserService.prototype.setCurrentUser = function(user) {
			return storage.set(USER_KEY, user);
		};

		UserService.prototype.me = function(next) {
			next = next || function(){};
			return User.me().success(function(user){
				next(null, user);
			}).error(next);
		};

		return new UserService();
	}]);