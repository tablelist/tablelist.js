
angular
	.module('tl')
	.service('tl.booking', ['tl.booking.resource', 'tl.booking.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);