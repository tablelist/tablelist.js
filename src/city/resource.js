
angular
	.module('tl')
	.factory('tl.city.resource', ['tl.resource', function(resource){
		return resource('/city/:id', {
			id: '@id'
		}, {
			
		});
	}]);