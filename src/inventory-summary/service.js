angular
  .module('tl')
  .service('tl.inventory-summary.service', [
    'tl.service',
    'tl.inventory-summary.resource',
    function(Service, InventorySummary) {
      'use strict';

      var InventorySummaryService = Service.extend(InventorySummary);

      InventorySummaryService.prototype.list = function(options) {
        if (!options) throw new Error('options is required');

        return InventorySummary.list(options).$promise;
      };

      return new InventorySummaryService();
    }
  ]);
