angular
  .module('tl')
  .factory('tl.ambassador.resource', ['tl.resource',
    function(resource) {

      var endpoint = '/ambassador';

      return resource(endpoint, {
        id: '@id'
      }, {
        getAll: {
          method: 'GET',
          url: 'ambassador',
          isArray: true
        }
      });
    }
  ]);
