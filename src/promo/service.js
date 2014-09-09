
angular
	.module('tl')
	.service('tl.promo.service', ['tl.storage', 'tl.promo.resource', 'tl.service', function(storage, Promo, Service){
		
		var PromoService = Service.extend(Promo);

		/**
		 * 
		 */
		PromoService.prototype.saveCurrentUser = function(user) {
			var _user = this.currentUser() || {};
			var keys = Object.keys(user);
			for (var i = 0; i < keys.length; i++) {
				var key = keys[i];
				var val = user[key];
				_user[key] = val;
			}
			this.setCurrentUser(_user);
		};

		/**
		 * Fetches the current user from the API
		 */
		UserService.prototype.me = function(success, error) {
			var _this = this;
			return User.me().$promise.then(function(user){
				_this.saveCurrentUser(user);
				if (success) {
					success(user);
				}
			}, error);
		};

		/**
		 * Updates the current user
		 */
		UserService.prototype.updateMe = function(body, success, error) {
			var _this = this;
			return User.updateMe({}, body).$promise.then(function(user){
				_this.saveCurrentUser(user);
				if (success) {
					success(user);
				}
			}, error);
		}; 

		/**
		 * Sets the users preferred city
		 */
		UserService.prototype.updatePreferredCity = function(cityId, success, error) {
			var _this = this;
			var body = { city: cityId };
			return User.updatePreferredCity({}, body).$promise.then(function(user){
				_this.saveCurrentUser(user);
				if (success) {
					success(user);
				}
			}, error);
		};

		/**
		 * Requests a verification code to verify a phone number
		 */
		UserService.prototype.requestVerificationCode = function(success, error) {
			return User.requestVerificationCode({}, success, error);
		};

		/**
		 * Verifies the users phone number
		 */
		UserService.prototype.verifyPhoneNumber = function(code, success, error) {
			var _this = this;
			var data = { verificationCode: code };
			return User.verifyPhoneNumber({}, data).$promise.then(function(user){
				_this.saveCurrentUser(user);
				if (success) {
					success(user);
				}
				return user;
			}, error);
		};

		/**
		 * Lists a user's payment profiles
		 */
		UserService.prototype.listPaymentProfiles = function(userId, success, error) {
			var _this = this;
			return User.listPaymentProfiles({ id : userId }).$promise;
		};

		/**
		 * Lists a user's referrals
		 */
		UserService.prototype.listReferrals = function(userId, success, error) {
			var _this = this;
			return User.listPaymentProfiles({ id : userId }).$promise;
		};

		/**
		 * Lists a user's bookings
		 */
		UserService.prototype.listBookings = function(userId, success, error) {
			var _this = this;
			return User.listBookings({ id : userId }).$promise;
		};

		/**
		 * Lists a user's promos
		 */
		UserService.prototype.listPromos = function(userId, success, error) {
			var _this = this;
			return User.listPromos({ id : userId }).$promise;
		};

		return new UserService();
	}]);