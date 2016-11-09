
angular
	.module('tl')
	.service('tl.subscription', ['tl.subscription.resource', 'tl.subscription.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);