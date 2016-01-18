
angular
	.module('tl')
	.factory('tl.client.resource', ['tl.resource', function(resource){

		var endpoint = '/client';

		return resource(endpoint, {
			// nothing here 
		}, {
			paymentToken: {
				method: 'GET',
				url: '/paymentToken',
				isArray: false
			},
			startup: {
				method: 'GET',
				url: '/startup',
				isArray: false
			}
		});
	}]);