angular.module('tl').service('tl.affiliatesale.service', [
  'tl.affiliatesale.resource',
  'tl.service',
  function(AffiliateSale, Service) {
    'use strict';

    var AffiliateSaleService = Service.extend(AffiliateSale);

    AffiliateSaleService.prototype.read = function read(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      return AffiliateSale.read(options).$promise;
    };

    AffiliateSaleService.prototype.update = function update(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      var id = options.id;
      delete options.id;

      return AffiliateSale.update({
        id: id
      }, options).$promise;
    };

    AffiliateSaleService.prototype.list = function(options) {
      if (!options) throw new Error('options is required');

      options.query = options.query ? JSON.stringify(options.query) : options.query;

      return AffiliateSale.list(options).$promise;
    };

    return new AffiliateSaleService();
  }
]);
