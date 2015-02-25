angular
  .module('tl')
  .service('tl.notify', ['tl.metric.resource', 'tl.metric.service', function(resource, service) {
    this.resource = resource;
    this.service = service;
  }]);
