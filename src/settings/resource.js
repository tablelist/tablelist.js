
angular
	.module('tl')
	.factory('tl.settings.resource', ['tl.resource', function(resource){

		var endpoint = '/config';

		return resource(endpoint, {
			// nothing here 
		}, {

			status: {
				method: 'GET',
				url: '/status',
				isArray: false
			},

			config: {
				method: 'GET',
				url: '/config',
				isArray: false
			}
		});
	}]);