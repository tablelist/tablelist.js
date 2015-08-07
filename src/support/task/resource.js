angular
  .module('tl')
  .factory('tl.support.task.resource', ['tl.resource', function(resource) {

    var endpoint = '/support/task';

    return resource(endpoint, {}, {

    });
  }]);
