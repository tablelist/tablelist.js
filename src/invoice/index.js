angular
  .module('tl')
  .service('tl.invoice', ['tl.invoice.resource', 'tl.invoice.service',
    function(resource, service) {
      this.resource = resource;
      this.service = service;
    }
  ]);
