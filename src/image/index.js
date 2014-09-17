angular
  .module('tl')
  .service('tl.image', ['tl.image.resource', 'tl.image.service',
    function(resource, service) {
      this.resource = resource;
      this.service = service;
    }
  ]);
