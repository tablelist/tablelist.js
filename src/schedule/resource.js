
angular
	.module('tl')
	.factory('tl.schedule.resource', ['tl.resource', function(resource){

		var endpoint = '/schedule/:id';

		return resource(endpoint, {
			id: '@id'
		}, {
			// add additional methods here
		});
	}]);