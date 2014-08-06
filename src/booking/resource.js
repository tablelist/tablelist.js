
angular
	.module('tl')
	.factory('tl.booking.resource', ['tl.resource', function(resource){
		return resource('/booking/:id', {
			id: '@id'
		}, {
			void: {
				method: 'POST',
				url: '/booking/:id/void'
			},
			refund: {
				method: 'POST',
				url: '/booking/:id/refund'
			}
		});
	}]);