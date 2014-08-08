
angular
	.module('tl')
	.factory('tl.inventory.resource', ['tl.resource', function(resource){

		var endpoint = '/inventory/:id';

		return resource(endpoint, {
			id: '@id'
		}, {
			// add additional methods here
		});
	}]);