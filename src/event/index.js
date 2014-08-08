
angular
	.module('tl')
	.service('tl.event', ['tl.event.resource', 'tl.event.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);