
angular
	.module('tl')
	.factory('tl.user', ['tl.storage', 'tl.user.resource', 'tl.service', function(storage, User, Service){
		
		var USER_KEY = 'tl_user';

		var UserService = Service.extend(User);

		UserService.prototype.currentUser = function() {
			return storage.get(USER_KEY);
		};

		UserService.prototype.setCurrentUser = function(user) {
			return storage.set(USER_KEY, user);
		};

		UserService.prototype.me = function(success, error) {
			return User.me().$promise.then(success, error);
		};

		return new UserService();
	}]);