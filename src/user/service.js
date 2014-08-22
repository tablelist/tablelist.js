
angular
	.module('tl')
	.service('tl.user.service', ['tl.storage', 'tl.user.resource', 'tl.service', function(storage, User, Service){
		
		var USER_KEY = 'tl_user';

		var UserService = Service.extend(User);

		UserService.prototype.currentUser = function() {
			return storage.get(USER_KEY);
		};

		UserService.prototype.setCurrentUser = function(user) {
			return storage.set(USER_KEY, user);
		};

		UserService.prototype.me = function(success, error) {
			var _this = this;
			return User.me().$promise.then(function(user){
				_this.setCurrentUser(user);
				if (success) {
					success(user);
				}
			}, error);
		};

		UserService.prototype.updateMe = function(body, success, error) {
			var _this = this;
			return User.update({}, body).$promise.then(function(user){
				_this.setCurrentUser(user);
				if (success) {
					success(user);
				}
			}, error);
		}; 

		return new UserService();
	}]);