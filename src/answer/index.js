
angular
	.module('tl')
	.service('tl.answer', ['tl.answer.resource', 'tl.answer.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);