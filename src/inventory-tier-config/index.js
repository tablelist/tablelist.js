angular
  .module('tl')
  .service('tl.inventory-tier-config', ['tl.inventory.resource', 'tl.inventory.service', function(resource, service) {
    this.resource = resource;
    this.service = service;
  }]);
