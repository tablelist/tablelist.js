angular
  .module('tl')
  .service('tl.inventory-tier-config', ['tl.inventory-tier-config.resource', 'tl.inventory-tier-config.service', function(resource, service) {
    this.resource = resource;
    this.service = service;
  }]);
