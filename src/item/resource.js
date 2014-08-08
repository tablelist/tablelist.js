
angular
	.module('tl')
	.factory('tl.item.resource', ['tl.resource', function(resource){

		var endpoint = '/item/:id';

		return resource(endpoint, {
			id: '@id'
		}, {
			// add additional methods here
		});
	}]);