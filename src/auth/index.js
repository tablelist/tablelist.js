
angular
	.module('tl')
	.service('tl.auth', ['tl.auth.resource', 'tl.auth.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);