
angular
	.module('tl')
	.factory('tl.payment.resource', ['tl.resource', function(resource){

		var endpoint = '/paymentProfile/:id';

		return resource(endpoint, {
			id: '@id'
		}, {
			// add additional methods here
		});
	}]);