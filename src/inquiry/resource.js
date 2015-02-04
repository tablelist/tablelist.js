
angular
	.module('tl')
	.factory('tl.inquiry.resource', ['tl.resource', function(resource){

		var endpoint = '/inquiry/:id';

		return resource(endpoint, {
			id: '@id'
		}, {
	      approve: {
	        method: 'POST',
	        url: endpoint + '/approve',
	        isArray: false
	      },
	      decline: {
	        method: 'POST',
	        url: endpoint + '/decline',
	        isArray: false
	      },
		});
	}]);