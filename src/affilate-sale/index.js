
angular
	.module('tl')
	.service('tl.affiliatesale', ['tl.affiliatesale.resource', 'tl.affiliatesale.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);