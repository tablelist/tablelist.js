
angular
	.module('tl')
	.service('tl.prospect', ['tl.prospect.resource', 'tl.prospect.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);