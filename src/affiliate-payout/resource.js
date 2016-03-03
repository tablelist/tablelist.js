angular.module('tl').factory('tl.affiliatepayout.resource', [
  'tl.resource',
  function(resource) {
    'use strict';

    var endpoint = '/affiliate-payout';

    return resource(endpoint, {
      id: '@id'
    }, {
      list: {
        method: 'GET',
        url: endpoint,
        isArray: true
      },
      update: {
        method: 'PUT',
        url: endpoint + '/:id',
      }
    });
  }
]);