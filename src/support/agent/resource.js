angular
  .module('tl')
  .factory('tl.support.agent.resource', ['tl.resource', function(resource) {

    var endpoint = '/agent';

    return resource(endpoint, {
      id: '@id'
    }, {
      read: {
        method: 'GET',
        url: endpoint + '/:id',
        isArray: false
      },
      list: {
        method: 'GET',
        url: endpoint,
        isArray: true
      },
      create: {
        method: 'POST',
        url: endpoint,
        isArray: false
      },
      update: {
        method: 'PUT',
        url: endpoint + '/:id',
        isArray: false
      },
      patch: {
        method: 'PATCH',
        url: endpoint + '/:id',
        isArray: false
      },
      remove: {
        method: 'DELETE',
        url: endpoint + '/:id',
        isArray: false
      },
    });
  }]);
