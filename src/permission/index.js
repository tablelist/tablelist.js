angular
  .module('tl')
  .service('tl.permission', ['tl.permission.resource', 'tl.permission.service', function(resource, service) {
    this.resource = resource;
    this.service = service;
  }]);
