
angular
	.module('tl')
	.factory('tl.track.resource', ['tl.resource', function(resource){

		var endpoint = '/track/:id';

		return resource(endpoint, {
			id: '@id'
		}, {
			// add additional methods here
		});
	}]);