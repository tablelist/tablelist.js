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
        url: 'affiliate'
      },
      listSales: {
        method: 'GET',
        url: 'affiliate/:id/sale',
        isArray: true
      },
      getSummary: {
        method: 'GET',
        url: 'affiliate/:id/summary',
        isArray: true
      }
    });
  }
]);
