
angular
	.module('tl')
	.service('tl.review', ['tl.review.resource', 'tl.review.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);