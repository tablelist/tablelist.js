angular
  .module('tl')
  .service('tl.tag', [
    'tl.tag.resource',
    'tl.tag.service',
    function(resource, service) {
      this.resource = resource;
      this.service = service;
    }
  ]);
