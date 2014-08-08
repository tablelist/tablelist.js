
angular
	.module('tl')
	.service('tl.reward', ['tl.reward.resource', 'tl.reward.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);