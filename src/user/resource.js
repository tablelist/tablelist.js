
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
			listBookings: { 
				method: 'GET',
				url: endpoint + '/booking',
				isArray: true
			},
			updatePreferredCity: {
				method: 'PUT',
				url: '/user/city'
			},
			requestVerificationCode: {
				method: 'GET',
				url: '/user/verify/:id'
			},
			requestVerificationCodeForCurrentUser: {
				method: 'GET',
				url: '/user/verify'
			},
			verifyPhoneNumber: {
				method: 'PUT',
				url: '/user/verify/:id'
			},
			verifyPhoneNumberForCurrentUser: {
				method: 'PUT',
				url: '/user/verify'
			},
			listPaymentProfiles: { 
				method: 'GET',
				url: '/user/:id/paymentProfiles',
				isArray: true
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
			},
			listPromos : {
				method: "GET",
				url: "/user/:id/promo",
				isArray: true
			},
			listTasks: { 
				method: 'GET',
				url: '/user/:id/task',
				isArray: true
			},
			listQuestions: { 
				method: 'GET',
				url: '/user/:id/question',
				isArray: true
			},
			listNotifications: {
				method: "GET",
				url: '/notify/:id',
				isArray: true
			},
			addCredit: {
				method: "POST",
				url: '/user/:id/credit'
			}
		});
	}]);