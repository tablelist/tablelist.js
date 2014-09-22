angular
  .module('tl')
  .factory('tl.invoice.resource', ['tl.resource',
    function(resource) {

      var endpoint = '/invoice/:id';

      return resource(endpoint, {
        id: '@id'
      }, {
        // add additional methods here

        readPdf: {
          method: 'GET',
          url: endpoint + '/pdf',
          isArray: false
        },
        createPdf: {
          method: 'POST',
          url: endpoint + '/pdf',
          isArray: false
        }

      });
    }
  ]);
