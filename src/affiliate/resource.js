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
      }
    });
  }
]);
