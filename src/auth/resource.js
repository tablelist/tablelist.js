
angular
	.module('tl')
	.factory('tl.auth.resource', ['tl.resource', function(resource){

		var endpoint = '/auth';

		return resource(endpoint, {
			// nothing here
		}, {

			register: {
				method: 'POST',
				url: endpoint + '/register',
				isArray: false
			},

			login: {
				method: 'POST',
				url: endpoint + '/login',
				isArray: false
			},

			loginFacebook: {
				method: 'POST',
				url: endpoint + '/facebook',
				isArray: false
			},

			forgotPassword: {
				method: 'POST',
				url: endpoint + '/forgot',
				isArray: false
			},

			resetPassword: {
				method: 'POST',
				url: endpoint + '/reset',
				isArray: false
			}

		});
	}]);