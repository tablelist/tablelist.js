
angular
	.module('tl')
	.factory('tl.report.resource', ['tl.resource', function(resource){

		var endpoint = '/report/:id';

		return resource(endpoint, {
			id: '@id'
		}, {
			reports: {
				method: 'GET',
				url: '/report-type'
			},
			download: {
				method: 'GET',
				url: endpoint + '/download'
			}
		});
	}]);