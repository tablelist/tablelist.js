
angular
	.module('tl')
	.factory('tl.inquiry.resource', ['tl.resource', function(resource){

		var endpoint = '/inquiry/:id';

		return resource(endpoint, {
			id: '@id'
		}, {
			// add additional methods here
		});
	}]);