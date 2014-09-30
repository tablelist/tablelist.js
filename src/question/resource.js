angular
  .module('tl')
  .factory('tl.question.resource', ['tl.resource',
    function(resource) {

      var endpoint = '/question';

      return resource(endpoint, {
        id: '@id'
      }, {
        get: {
          method: 'GET',
          url: endpoint + '/:id'
        }
      });
    }
  ]);
