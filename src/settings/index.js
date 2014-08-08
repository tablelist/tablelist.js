
angular
	.module('tl')
	.service('tl.settings', ['tl.settings.resource', 'tl.settings.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);