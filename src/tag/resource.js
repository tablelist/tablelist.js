angular
  .module('tl')
  .factory('tl.tag.resource', ['tl.resource', function(resource) {

    var endpoint = '/tag';

    return resource(endpoint, {}, {
      //additional methods here
      list: {
        method: 'GET',
        url: endpoint,
        isArray: true
      }
    });
  }]);
