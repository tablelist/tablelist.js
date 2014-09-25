angular
  .module('tl')
  .factory('tl.answer.resource', ['tl.resource',
    function(resource) {

      var endpoint = '/answer';

      return resource(endpoint, {
        // nothing here
      }, {});
    }
  ]);
