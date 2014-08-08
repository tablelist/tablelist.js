
angular
	.module('tl')
	.factory('tl.reward.resource', ['tl.resource', function(resource){

		var endpoint = '/reward/:id';

		return resource(endpoint, {
			id: '@id'
		}, {
			// add additional methods here
		});
	}]);