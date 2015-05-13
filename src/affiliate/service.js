angular.module('tl').service('tl.affiliate.service', [
  'tl.affiliate.resource',
  'tl.service',
  function(Affilate, Service) {
    'use strict';

    var AffiliateService = Service.extend(Affilate);

    AffiliateService.prototype.create = function(options) {
      if (!options) throw new Error('options is required');

      return Affilate.create({}, options).$promise;
    };
  }
]);
