
angular
	.module('tl')
	.factory('tl.user.resource', ['tl.resource', function(resource){
		
		var endpoint = '/user/:id';

		return resource(endpoint, {
			id: '@id'
		}, {
			me: {
				method: 'GET',
				url: '/me'
			},
			updateMe: {
				method: 'PUT',
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
				url: endpoint + '/referral',
				isArray: true
			},
			listBookings: { 
				method: 'GET',
				url: endpoint + '/booking',
				isArray: true
			},
			requestVerificationCode: {
				method: 'GET',
				url: '/user/verify'
			},
			verifyPhoneNumber: {
				method: 'PUT',
				url: '/user/verify'
			}
		});
	}]);