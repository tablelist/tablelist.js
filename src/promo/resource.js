
angular
	.module('tl')
	.factory('tl.promo.resource', ['tl.resource', function(resource){
		
		var endpoint = '/promo/:id';

		return resource(endpoint, {
			id: '@id'
		}, {
			redeem: {
				method: 'POST',
				url: '/promo/redeem'
			},
		});
	}]);