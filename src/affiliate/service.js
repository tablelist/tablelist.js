angular.module('tl').service('tl.affiliate.service', [
  'tl.affiliate.resource',
  'tl.service',
  function(Affiliate, Service) {
    'use strict';

    var AffiliateService = Service.extend(Affiliate);

    AffiliateService.prototype.create = function(options) {
      if (!options) throw new Error('options is required');

      return Affiliate.create({}, options).$promise;
    };
  }
]);
