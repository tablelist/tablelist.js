angular
  .module('tl')
  .factory('tl.support.message.resource', ['tl.resource', function(resource) {

    var endpoint = '/support/message';

    return resource(endpoint, {}, {
      list: {
        method: 'GET',
        url: endpoint,
        isArray: true
      },
      sendInboundMessage: {
        method: 'POST',
        url: endpoint + '/inbound',
        isArray: false
      },
      sendOutboundMessage: {
        method: 'POST',
        url: endpoint + '/outbound',
        isArray: false
      },
      sendInternalMessage: {
        method: 'POST',
        url: endpoint + '/internal',
        isArray: false
      }
    });
  }]);
