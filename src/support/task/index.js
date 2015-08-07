angular
  .module('tl')
  .service('tl.support.task', [
    'tl.support.task.resource',
    'tl.support.task.service',
    function(resource, service) {
      this.resource = resource;
      this.service = service;
    }
  ]);
