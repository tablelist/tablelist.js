
angular
	.module('tl')
	.service('tl.outgoingPayment', ['tl.outgoingPayment.resource', 'tl.outgoingPayment.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);