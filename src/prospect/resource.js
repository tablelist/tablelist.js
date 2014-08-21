
angular
	.module('tl')
	.factory('tl.prospect.resource', ['tl.resource', function(resource){

		var endpoint = '/prospect/:id';

		return resource(endpoint, {
			id: '@id'
		}, {
			// add additional methods here
		});
	}]);