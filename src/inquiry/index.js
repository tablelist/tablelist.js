
angular
	.module('tl')
	.service('tl.inquiry', ['tl.inquiry.resource', 'tl.inquiry.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);