angular
  .module('tl')
  .factory('tl.sale.resource', ['tl.resource', function(resource) {

    var endpoint = '/sale';

    return resource(endpoint, {
      id: '@id'
    }, {
      list: {
        method: 'GET',
        url: endpoint,
        isArray: true
      }
    });
  }]);
