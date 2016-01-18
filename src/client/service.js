
angular
	.module('tl')
	.service('tl.client.service', ['tl.service', 'tl.client.resource', function(Service, Client){

		var ClientService = function(){};

		/**
		 * Generate new merchant payment token (for use with Braintree API)
		 */
		ClientService.prototype.paymentToken = function(success, error) {
			return Client.paymentToken({}, success, error);
		};

		/**
		 * Get's the startup config object
		 */
		ClientService.prototype.startup = function(success, error) {
			return Client.startup({}, success, error);
		};

		return new ClientService();
	}]);