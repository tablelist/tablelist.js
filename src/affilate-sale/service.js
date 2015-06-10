angular.module('tl').service('tl.affiliatesale.service', [
  'tl.affiliatesale.resource',
  'tl.service',
  '$http',
  'tl.http',
  function(AffiliateSale, Service, $http, http) {
    'use strict';

    var AffiliateSaleService = Service.extend(AffiliateSale);

    AffiliateSaleService.prototype.list = function(options) {
      if (!options) throw new Error('options is required');

      options.query = options.query ? JSON.stringify(options.query) : options.query;
      
      return AffiliateSale.list(options).$promise;
    };

    return new AffiliateSaleService();
  }
]);
