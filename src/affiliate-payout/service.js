angular.module('tl').service('tl.affiliatepayout.service', [
  'tl.affiliatepayout.resource',
  'tl.service',
  function(AffiliatePayout, Service) {
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
