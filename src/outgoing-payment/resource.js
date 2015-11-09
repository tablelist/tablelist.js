angular.module('tl').factory('tl.outgoingPayment.resource', [
  'tl.resource',
  function(resource) {
    'use strict';

    var endpoint = '/outgoing-payment/:id';

    return resource(endpoint, {
      id: '@id'
    }, {
      listTransaction: {
        method: 'GET',
        url: endpoint + '/transaction',
        isArray: true
      },
      listAuthorization: {
        method: 'GET',
        url: endpoint + '/authorization',
        isArray: true
      },
      update: {
        method: 'PUT',
        url: endpoint
      },
      delete: {
        method: 'DELETE',
        url: endpoint
      },
    });
  }
]);
