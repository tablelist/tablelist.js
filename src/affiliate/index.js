
angular
	.module('tl')
	.service('tl.affiliate', ['tl.affiliate.resource', 'tl.affiliate.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);