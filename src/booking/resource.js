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
      cancellation: {
        method: 'POST',
        url: endpoint + '/cancellation'
      },
      join: {
        method: 'POST',
        url: 'booking/join'
      },
      decline: {
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
      createOutgoingPayment: {
        method: 'POST',
        url: endpoint + '/outgoing-payment',
      },
      readSplitTable: {
        method: 'GET',
        url: 'booking/split/:code'
      },
      listTerms: {
        method: 'GET',
        url: 'booking/:id/terms',
        isArray: true
      },
      addCondition: {
        method: 'POST',
        url: 'booking/:id/condition'
      },
      accept: {
        method: 'POST',
        url: 'booking/:id/accept'
      },
      authorize: {
        method: 'POST',
        url: 'booking/:id/authorize'
      },
      refundBookingUser: {
        method: 'POST',
        url: endpoint + '/user/:userId/refund',
      },
      listBookingTickets: {
        method: 'GET',
        url: endpoint + '/ticket',
        isArray: true
      }
    });
  }
]);
