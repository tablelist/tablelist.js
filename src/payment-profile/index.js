
angular
	.module('tl')
	.service('tl.payment', ['tl.payment.resource', 'tl.payment.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);