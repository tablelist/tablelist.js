angular
  .module('tl')
  .factory('tl.user.resource', ['tl.resource', function(resource) {
    'use strict';

    var endpoint = '/user/:id';

    return resource(endpoint, {
      id: '@id'
    }, {
      list: {
        method: 'GET',
        url: '/user',
        isArray: true
      },
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
        url: endpoint + '/paymentProfiles',
        isArray: true
      },
      listReferrals: {
        method: 'GET',
        url: endpoint + '/referral',
        isArray: true
      },
      listPromos: {
        method: "GET",
        url: endpoint + "/promo",
        isArray: true
      },
      listTasks: {
        method: 'GET',
        url: endpoint + '/task',
        isArray: true
      },
      listQuestions: {
        method: 'GET',
        url: endpoint + '/question',
        isArray: true
      },
      listAnswers: {
        method: 'GET',
        url: endpoint + '/answer',
        isArray: true
      },
      listNotifications: {
        method: "GET",
        url: '/notify/:id',
        isArray: true
      },
      listHighPriority: {
        method: "GET",
        url: '/user/priority',
        isArray: true
      },
      addCredit: {
        method: "POST",
        url: endpoint + '/credit'
      },
      findByReferral: {
        method: "GET",
        url: '/referral/:code'
      },
      getReferralStats: {
        method: "GET",
        url: endpoint + '/referral/stats'
      },
      listVenues: {
        method: "GET",
        url: endpoint + '/venue',
        isArray: true
      },
      listStats: {
        method: "GET",
        url: endpoint + '/stats',
        isArray: true
      },
      favorite: {
        method: "POST",
        url: endpoint + '/favorite',
        isArray: false
      },
      unfavorite: {
        method: "DELETE",
        url: endpoint + '/favorite/:favoriteId',
        isArray: false
      },
      listFavorites: {
        method: "GET",
        url: endpoint + '/favorite',
        isArray: true
      },
      listReviews: {
        method: 'GET',
        url: endpoint + '/reviews',
        isArray: true
      },
      markAffiliate: {
        method: "POST",
        url: endpoint + '/affiliate',
        isArray: false
      },
      listAffiliates: {
        method: "GET",
        url: 'user/:id/affiliate',
        isArray: true
      },
      access: {
        method: 'GET',
        url: 'user/:id/access',
        isArray: true
      }
    });
  }]);
