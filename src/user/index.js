
angular
	.module('tl')
	.service('tl.user', ['tl.user.resource', 'tl.user.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);