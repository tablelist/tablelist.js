angular.module('tl').factory('tl.affiliatesale.resource', [
  'tl.resource',
  function(resource) {
    'use strict';

    var endpoint = '/affiliate-sale/:id';

    return resource(endpoint, {
      id: '@id'
    }, {
      list: {
        method: 'GET',
        url: endpoint,
        isArray: true
      }
    });
  }
]);
