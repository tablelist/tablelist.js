
angular
	.module('tl')
	.factory('tl.user.resource', ['tl.resource', function(resource){
		return resource('/user/:id', {
			id: '@id'
		}, {
			me: {
				method: 'GET',
				url: '/me'
			},
			search: {
				method: 'GET',
				url: '/user/search',
				isArray: true
			},
			push: {
				method: 'POST',
				url: '/notify/push',
				isArray: false
			},
			listReferrals: { 
				method: 'GET',
				url: '/user/:id/referral',
				isArray: true
			},
			listBookings: { 
				method: 'GET',
				url: '/user/:id/booking',
				isArray: true
			}
		});
	}]);