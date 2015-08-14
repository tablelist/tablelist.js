angular
  .module('tl')
  .service('tl.inventory-summary', ['tl.inventory-summary.resource', 'tl.inventory-summary.service', function(resource, service) {
    this.resource = resource;
    this.service = service;
  }]);
