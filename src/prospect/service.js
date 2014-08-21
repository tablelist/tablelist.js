
angular
	.module('tl')
	.service('tl.prospect.service', ['tl.service', 'tl.prospect.resource', function(Service, Prospect){

		var ProspectService = Service.extend(Prospect);

		return new ProspectService();
	}]);