
angular
	.module('tl')
	.service('tl.report', ['tl.report.resource', 'tl.report.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);