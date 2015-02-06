angular.module('tl').factory('tl.outgoingPayment.resource', [
  'tl.resource',
  function(resource) {
    'use strict';

    var endpoint = '/outgoing-payment/:id';

    return resource(endpoint, {
      id: '@id'
    }, {
      listTransactions: {
        method: 'GET',
        url: endpoint + '/transaction',
        isArray: true
      },
      listAuthorizations: {
        method: 'GET',
        url: endpoint + '/authorization',
        isArray: true
      }
    });
  }
]);
