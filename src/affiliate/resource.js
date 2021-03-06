angular.module('tl').factory('tl.affiliate.resource', [
  'tl.resource',
  function(resource) {
    'use strict';

    var endpoint = '/affiliate/:id';

    return resource(endpoint, {
      id: '@id'
    }, {
      getById: {
        method: 'GET',
        url: endpoint,
        isArray: false
      },
      getPayoutStructuresById: {
        method: 'GET',
        url: endpoint + '/payoutstructure',
        isArray: true
      },
      create: {
        method: 'POST',
        url: 'affiliate',
        isArray: false
      },
      update: {
        method: 'PATCH',
        url: endpoint,
        isArray: false
      },
      activate: {
        method: 'POST',
        url: endpoint + '/activate',
        isArray: false
      },
      list: {
        method: 'GET',
        url: 'affiliate',
        isArray: true
      },
      listSales: {
        method: 'GET',
        url: endpoint + '/sale',
        isArray: true
      },
      getSalesTotal: {
        method: 'GET',
        url: endpoint + '/sale/total'
      },
      getSalesLeaderboard: {
        method: 'GET',
        url: endpoint + '/leaderboard',
        isArray: true
      },
      getPayoutPeriod: {
        method: 'GET',
        url: endpoint + '/payout-period',
        isArray: true
      },
      getPromoCode: {
        method: 'GET',
        url: endpoint + '/promo',
        isArray: true
      },
      getTrackers: {
        method: 'GET',
        url: endpoint + '/tracker',
        isArray: true
      },
      getApiKeys: {
        method: 'GET',
        url: endpoint + '/api-key',
        isArray: true
      }
    });
  }
]);
