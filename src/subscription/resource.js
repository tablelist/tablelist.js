angular
	.module('tl')
	.factory('tl.subscription.resource', ['tl.resource', function(resource){

    var endpoint = '/subscription/:id';

		return resource(endpoint, {
      id: '@id'
		}, {
      cancelSubscription: {
        method: "DELETE",
        url: '/subscription'
      },
      subscriptionAction: {
        method: "POST",
        url: endpoint + '/action',
        params: {
          id: '@id'
        }
      }
    });
	}]);