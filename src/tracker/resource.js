angular
  .module('tl')
  .factory('tl.tracker.resource', ['tl.resource', function(resource) {

    var endpoint = '/tracker';

    return resource(endpoint, {}, {
      //additional methods here
      create: {
        method: 'POST',
        url: endpoint,
        isArray: false
      }
    });
  }]);
