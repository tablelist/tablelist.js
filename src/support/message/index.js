angular
  .module('tl')
  .service('tl.support.message', [
    'tl.support.message.resource',
    'tl.support.message.service',
    function(resource, service) {
      this.resource = resource;
      this.service = service;
    }
  ]);
