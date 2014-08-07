
angular
	.module('tl')
	.service('tl.auth', ['tl.keychain', 'tl.http', 'tl.user', 'tl.facebook', function(keychain, http, user, fb){
		
		var Auth = function(){};

		Auth.prototype.authToken = function() {
			return keychain.authToken();
		};

		Auth.prototype.setAuthToken = function(token) {
			return keychain.setAuthToken(token);
		};

		Auth.prototype.register = function(email, password, firstName, lastName, next) {
			next = next || function(){};
			var _this = this;
			return http.post('/auth/register', {
				email: email,
				password: password,
				firstName: firstName,
				lastName: lastName
			}).success(function(auth){
				_this.setAuthToken(auth.token);
				user.setCurrentUser(auth.user);
				next(null, auth.user);
			}).error(next);
		};

		Auth.prototype.login = function(email, password, next) {
			next = next || function(){};
			var _this = this;
			return http.post('/auth/login', {
				email: email,
				password: password
			}).success(function(auth){
				_this.setAuthToken(auth.token);
				user.setCurrentUser(auth.user);
				next(null, auth.user);
			}).error(next);
		};

		Auth.prototype.loginWithFacebook = function(next) {
			next = next || function(){};
			var _this = this;
			fb.login(function(err, token){
				if (err) return next(err);
				
				http.post('/auth/facebook', {
					facebookToken: token
				}).success(function(auth){
					_this.setAuthToken(auth.token);
					user.setCurrentUser(auth.user);
					next(null, auth.user);
				}).error(next);
			});
		};

		Auth.prototype.logout = function() {
			this.setAuthToken(null);
			user.setCurrentUser(null);
		};

		Auth.prototype.forogtPassword = function(email, next) {
			next = next || function(){};
			return http.post('/auth/forgot', {
				email: email
			}).success(function(res){
				next(null, res);
			}).error(next);	
		};

		Auth.prototype.resetPassword = function(token, password, next) {
			next = next || function(){};
			return http.post('/auth/reset', {
				resetToken: token,
				password: password
			}).success(function(res){
				next(null, res);
			}).error(next);
		};

		return new Auth();
	}]);