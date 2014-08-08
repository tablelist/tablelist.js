
angular
	.module('tl')
	.service('tl.track', ['tl.track.resource', 'tl.track.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);