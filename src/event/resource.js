
angular
	.module('tl')
	.factory('tl.event.resource', ['tl.resource', function(resource){

		var endpoint = '/event/:id';

		return resource(endpoint, {
			id: '@id',
			imageId: '@imageId'
		}, {
			/*==============================================================*
			/* Cities
			/*==============================================================*/

			listForCity: {
				method: 'GET',
				url: '/city/:cityId/event',
				isArray: true
			}

		});
	}]);