angular
  .module('tl')
  .factory('tl.event.resource', ['tl.resource', function(resource) {

    var endpoint = '/event/:id';

    return resource(endpoint, {
      id: '@id',
      imageId: '@imageId'
    }, {
      update: {
        method: 'PATCH',
        url: endpoint,
        isArray: false
      },
      list: {
        method: 'GET',
        url: '/event',
        isArray: true
      },
      listForCity: {
        method: 'GET',
        url: '/city/:cityId/event',
        isArray: true
      },
      addStaff: {
        method: 'POST',
        url: endpoint + '/staff',
        isArray: false
      },
      updateStaff: {
        method: 'PUT',
        url: endpoint + '/staff/:staffId',
        isArray: false
      },
      deleteStaff: {
        method: 'DELETE',
        url: endpoint + '/staff/:staffId',
        isArray: false
      },
    });
  }]);
