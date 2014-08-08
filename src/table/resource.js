
angular
	.module('tl')
	.factory('tl.table.resource', ['tl.resource', function(resource){

		var endpoint = '/table/:id';

		return resource(endpoint, {
			id: '@id'
		}, {
			// add additional methods here
		});
	}]);