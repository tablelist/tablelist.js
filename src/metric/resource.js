
angular
	.module('tl')
	.factory('tl.metric.resource', ['tl.resource', function(resource){
		
		var endpoint = '/metric/:id';

		return resource(endpoint, {
			id: '@id'
		}, {
			available: {
				method: 'GET',
				url: '/metric/available',
				isArray: true
			},

			queryMetrics: {
				method: 'GET',
				url: '/metric'
			}
		});
	}]);