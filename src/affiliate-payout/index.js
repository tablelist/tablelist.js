angular
	.module('tl')
	.service('tl.affiliatepayout', ['tl.affiliatepayout.resource', 'tl.affiliatepayout.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);