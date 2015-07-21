angular
  .module('tl')
  .service('tl.tracker', [
    'tl.tracker.resource',
    'tl.tracker.service',
    function(resource, service) {
      this.resource = resource;
      this.service = service;
    }
  ]);
