angular
  .module('tl')
  .factory('tl.inventory-tier-config.resource', [
    'tl.resource',
    function(resource) {
      'use strict';

      var endpoint = '/inventory-tier-config/:id';

      return resource(endpoint, {
        id: '@id'
      }, {
        list: {
          method: 'GET',
          url: '/inventory-tier-config',
          isArray: true
        },
        create: {
          method: 'POST',
          url: '/inventory-tier-config',
          isArray: false
        },
        update: {
          method: 'PATCH',
          url: endpoint,
          isArray: false
        }
      });
    }
  ]);
