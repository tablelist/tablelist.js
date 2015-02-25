angular
  .module('tl')
  .factory('tl.notify.resource', ['tl.resource', function(resource) {

    var endpoint = '/notify/adminapp';

    return resource(endpoint, {
      id: '@id'
    }, {
      sendAdminApp: {
        method: 'POST',
        url: endpoint,
        isArray: false
      }
    });
  }]);
