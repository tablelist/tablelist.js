
angular
	.module('tl')
	.service('tl.metric', ['tl.metric.resource', 'tl.metric.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);