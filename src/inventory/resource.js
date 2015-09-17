angular
  .module('tl')
  .factory('tl.inventory.resource', [
    'tl.resource',
    function(resource) {
      'use strict';

      var endpoint = '/inventory/:id';

      return resource(endpoint, {
        id: '@id',
        tierId: '@tierId'
      }, {
        listForVenue: {
          method: 'GET',
          url: '/inventory',
          isArray: true
        },
        createTier: {
          method: 'POST',
          url: endpoint + '/tier',
          isArray: false
        },
        updateTier: {
          method: 'PUT',
          url: endpoint + '/tier/:tierId',
          isArray: false
        },
        deleteTier: {
          method: 'DELETE',
          url: endpoint + '/tier/:tierId',
          isArray: false
        }
      });
    }
  ]);
