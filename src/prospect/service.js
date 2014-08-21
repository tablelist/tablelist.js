
angular
	.module('tl')
	.service('tl.prospect.service', ['tl.service', 'tl.prospect.resource', function(Service, Prospect){

		var ProspectService = Service.extend(Prospect);

		ProspectService.prototype.updateProspect = function(data, success, error) {
			return Prospect.update({}, data, success, error);
		};

		return new ProspectService();
	}]);