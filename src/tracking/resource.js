
angular
	.module('tl')
	.factory('tl.track.resource', ['tl.resource', function(resource){

		var endpoint = '/track/:id';

		return resource(endpoint, {
			id: '@id'
		}, {
			funnel: {
			 	method: 'POST',
			 	url: '/track/funnel',
			 	isArray: true
			}
		});
	}]);