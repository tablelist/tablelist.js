angular.module('tl').service('tl.affiliate.service', [
  'tl.affiliate.resource',
  'tl.service',
  function(Affiliate, Service) {
    'use strict';

    var AffiliateService = Service.extend(Affiliate);

    AffiliateService.prototype.getById = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      return Affiliate.getById(options).$promise;
    };

    AffiliateService.prototype.create = function(options) {
      if (!options) throw new Error('options is required');

      return Affiliate.create({}, options).$promise;
    };

    AffiliateService.prototype.listSales = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      return Affiliate.listSales(options).$promise;
    };

    AffiliateService.prototype.getSummary = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      return Affiliate.getSummary(options).$promise
    }

    return new AffiliateService();
  }
]);
