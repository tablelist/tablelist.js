
angular
	.module('tl')
	.service('tl.sale', ['tl.sale.resource', 'tl.sale.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);
