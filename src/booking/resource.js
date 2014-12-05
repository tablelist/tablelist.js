angular
  .module('tl')
  .factory('tl.booking.resource', ['tl.resource', function(resource) {

    var endpoint = '/booking/:id';

    return resource(endpoint, {
      id: '@id'
    }, {
      create: {
        method: 'POST',
        url: 'booking',
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
      updateBookingUser: {
        method: 'PUT',
        url: endpoint + '/users/:userId/'
      },
      readOutgoingPayment: {
        method: 'GET',
        url: endpoint + '/outgoing-payment'
      }
    });
  }]);
