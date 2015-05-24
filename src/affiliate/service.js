angular.module('tl').service('tl.affiliate.service', [
  'tl.affiliate.resource',
  'tl.service',
  '$http',
  'tl.http',
  function(Affiliate, Service, $http, http) {
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

    AffiliateService.prototype.getSalesTotal = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      return Affiliate.getSalesTotal(options).$promise;
    };

    AffiliateService.prototype.listSalesAsCsv = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      return $http({
        method: 'GET',
        url: http.apiUrl('/affiliate/' + options.id + '/sale'),
        headers: {
          'Content-Type': 'text/csv'
        },
        data: options
      });
    };

    AffiliateService.prototype.getSalesLeaderboard = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      return Affiliate.getSalesLeaderboard(options).$promise;
    };

    return new AffiliateService();
  }
]);
