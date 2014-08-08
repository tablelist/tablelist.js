
angular
	.module('tl')
	.service('tl.city', ['tl.city.resource', 'tl.city.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);