angular
  .module('tl')
  .factory('tl.inventory-summary.resource', [
    'tl.resource',
    function(resource) {
      'use strict';

      var endpoint = '/inventory-summary';

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
