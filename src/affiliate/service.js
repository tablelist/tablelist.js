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

    AffiliateService.prototype.getPayoutStructuresById = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      return Affiliate.getPayoutStructuresById(options).$promise;
    };

    AffiliateService.prototype.list = function(options) {
      if (!options) throw new Error('options is required');

      return Affiliate.list(options).$promise;
    };

    AffiliateService.prototype.create = function(options) {
      if (!options) throw new Error('options is required');

      return Affiliate.create({}, options).$promise;
    };

    AffiliateService.prototype.update = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      var affiliateId = options.id;
      delete options.id;

      return Affiliate.update({
        id: affiliateId
      }, options).$promise;
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

      var affiliateId = options.id;
      delete options.id;

      return $http.get(http.apiUrl('/affiliate/' + affiliateId + '/sale'), {
        params: options,
        data: '', //needed, otherwise the content-type header is not sent (the req must have a body)
        headers: {
          'Content-Type': 'text/csv'
        }
      });
    };

    AffiliateService.prototype.getSalesLeaderboard = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      return Affiliate.getSalesLeaderboard(options).$promise;
    };

    AffiliateService.prototype.getPayoutPeriod = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      return Affiliate.getPayoutPeriod(options).$promise;
    };

    AffiliateService.prototype.getPromoCode = function(options) {
      if(!options) throw new Error('options is required');
      if(!options.id) throw new Error('options.id is required');

      return Affiliate.getPromoCode(options).$promise;
    };

    return new AffiliateService();
  }
]);
