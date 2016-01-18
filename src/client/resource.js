
angular
	.module('tl')
	.factory('tl.client.resource', ['tl.resource', function(resource){

		var endpoint = '/client';

		return resource(endpoint, {
			// nothing here 
		}, {
			paymentToken: {
				method: 'POST',
				url: endpoint + '/paymentToken',
				isArray: false
			},
			startup: {
				method: 'GET',
				url: endpoint + '/startup',
				isArray: false
			}
		});
	}]);