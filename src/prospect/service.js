
angular
	.module('tl')
	.service('tl.prospect.service', ['tl.service', 'tl.prospect.resource', function(Service, Prospect){

		var ProspectService = Service.extend(Prospect);

		/**
		 * Updates the current prospect
		 */
		ProspectService.prototype.updateProspect = function(data, success, error) {
			delete data._id;
			delete data.id;
			
			return Prospect.update({}, data, success, error);
		};

		return new ProspectService();
	}]);