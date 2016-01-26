
angular
	.module('tl')
	.service('tl.client.service', ['tl.service', 'tl.client.resource', function(Service, Client){

		var ClientService = function(){};

		/**
		 * Generate new merchant payment token (for use with Braintree API)
		 */
		ClientService.prototype.paymentToken = function() {
			return Client.paymentToken().$promise;
		};

		/**
		 * Get's the startup config object
		 */
		ClientService.prototype.startup = function() {
			return Client.startup().$promise;
		};

		return new ClientService();
	}]);