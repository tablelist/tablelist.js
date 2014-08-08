
angular
	.module('tl')
	.service('tl.venue', ['tl.venue.resource', 'tl.venue.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);