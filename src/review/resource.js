
angular
	.module('tl')
	.factory('tl.review.resource', ['tl.resource', function(resource){

		var endpoint = '/review/:id';

		return resource(endpoint, {
			id: '@id'
		}, {
			// add additional methods here
		});
	}]);