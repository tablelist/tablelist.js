
angular
	.module('tl')
	.service('tl.schedule', ['tl.schedule.resource', 'tl.schedule.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);