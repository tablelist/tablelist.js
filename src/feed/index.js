angular
  .module('tl')
  .service('tl.feed', ['tl.feed.resource', 'tl.feed.service',
    function(resource, service) {
      this.resource = resource;
      this.service = service;
    }
  ]);
