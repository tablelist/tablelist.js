
angular
	.module('tl')
	.factory('tl.campaign.resource', ['tl.resource', function(resource){
		
		var endpoint = '/campaign/:id';

		return resource(endpoint, {
			id: '@id'
		}, {
			
		});
	}]);