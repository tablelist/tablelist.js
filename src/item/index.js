
angular
	.module('tl')
	.service('tl.item', ['tl.item.resource', 'tl.item.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);