angular.module('tl').factory('tl.booking.resource', [
  'tl.resource',
  function(resource) {
    'use strict';

    var endpoint = '/booking/:id';

    return resource(endpoint, {
      id: '@id'
    }, {
      read: {
        method: 'GET',
        url: endpoint
      },
      create: {
        method: 'POST',
        url: 'booking'
      },
      complete: {
        method: 'POST',
        url: endpoint + '/complete'
      },
      void: {
        method: 'POST',
        url: endpoint + '/void'
      },
      refund: {
        method: 'POST',
        url: endpoint + '/refund'
      },
      join: {
        method: 'POST',
        url: 'booking/join'
      },
      accept: {
        method: 'POST',
        url: endpoint + '/accept'
      },
      decline : {
        method: 'POST',
        url: endpoint + '/decline'
      },
      updateBookingUser: {
        method: 'PUT',
        url: endpoint + '/users/:userId'
      },
      listOutgoingPayment: {
        method: 'GET',
        url: endpoint + '/outgoing-payment',
        isArray: true
      },
      readSplitTable: {
        method: 'GET',
        url: 'booking/split/:code'
      },
      listTerms: {
        method: 'GET',
        url: 'booking/:id/terms',
        isArray: true
      }
    });
  }
]);
