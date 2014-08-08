
angular
	.module('tl')
	.service('tl.table', ['tl.table.resource', 'tl.table.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);