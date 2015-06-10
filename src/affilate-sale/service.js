angular.module('tl').service('tl.affiliatesale.service', [
  'tl.affiliatesale.resource',
  'tl.service',
  '$http',
  'tl.http',
  function(AffiliateSale, Service, $http, http) {
    'use strict';

    var AffiliateSaleService = Service.extend(AffiliateSale);

    AffiliateService.prototype.list = function(options) {
      if (!options) throw new Error('options is required');

      return AffiliateSale.list(options).$promise;
    };

    return new AffiliateService();
  }
]);
