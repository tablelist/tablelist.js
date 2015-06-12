angular.module('tl').service('tl.affiliatepayout.service', [
  'tl.affiliatepayout.resource',
  'tl.service',
  '$http',
  'tl.http',
  function(AffiliatePayout, Service, $http, http) {
    'use strict';

    var AffiliatePayoutService = Service.extend(AffiliatePayout);

    AffiliatePayoutService.prototype.list = function(options) {
      if (!options) throw new Error('options is required');

      options.query = options.query ? JSON.stringify(options.query) : options.query;
      
      return AffiliatePayout.list(options).$promise;
    };

    return new AffiliatePayoutService();
  }
]);