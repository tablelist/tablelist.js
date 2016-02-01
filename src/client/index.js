
angular
	.module('tl')
	.service('tl.client', ['tl.client.resource', 'tl.client.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);