
angular
	.module('tl')
	.service('tl.ambassador ', ['tl.ambassador.resource', 'tl.ambassador.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);