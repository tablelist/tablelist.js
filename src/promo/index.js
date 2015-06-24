angular
  .module('tl')
  .service('tl.promo', ['tl.promo.resource', 'tl.promo.service', function(resource, service) {
    this.resource = resource;
    this.service = service;
  }]);
