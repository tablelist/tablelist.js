angular
  .module('tl')
  .factory('tl.inventory.resource', [
    'tl.resource',
    function(resource) {
      'use strict';

      var endpoint = '/inventory/:id';

      return resource(endpoint, {
        id: '@id'
      }, {
        listForVenue: {
          method: 'GET',
          url: '/inventory'
        }
      });
    }
  ]);
