angular
  .module('tl')
  .service('tl.support.agent', [
    'tl.support.agent.resource',
    'tl.support.agent.service',
    function(resource, service) {
      this.resource = resource;
      this.service = service;
    }
  ]);
