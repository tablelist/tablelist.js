angular
  .module('tl')
  .factory('tl.permission.resource', ['tl.resource', function(resource) {

    var endpoint = '/permission/:id';

    return resource(endpoint, {
      id: '@id'
    }, {
      listVenuePermissions: {
        method: 'GET',
        url: '/permission/venue'
      },
    });
  }]);
