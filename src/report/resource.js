
angular
	.module('tl')
	.factory('tl.report.resource', ['tl.resource', function(resource){

		var endpoint = '/report/:id';

		return resource(endpoint, {
			id: '@id'
		}, {
			// add additional methods here
		});
	}]);