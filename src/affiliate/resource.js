angular.module('tl').factory('tl.affiliate.resource', [
  'tl.resource',
  function(resource) {
    'use strict';

    var endpoint = '/affiliate/:id';

    return resource(endpoint, {
      id: '@id'
    }, {
      create: {
        method: 'POST',
        url: 'affiliate'
      }
    });
  }
]);
