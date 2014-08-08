
angular
	.module('tl')
	.service('tl.inventory', ['tl.inventory.resource', 'tl.inventory.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);