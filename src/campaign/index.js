
angular
	.module('tl')
	.service('tl.campaign', ['tl.campaign.resource', 'tl.campaign.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);