angular
  .module('tl')
  .service('tl.inventory.service', [
    'tl.service',
    'tl.inventory.resource',
    function(Service, Inventory) {
      'use strict';

      var InventoryService = Service.extend(Inventory);

      InventoryService.prototype.listForVenue = function(options) {
        if (!options) throw new Error('options is required');
        if (!options.venue) throw new Error('options.venue is required');

        options.start = options.start || moment().startOf('month').format("YYYY-MM-DD");
        options.end = options.end || moment().endOf('month').format("YYYY-MM-DD");

        return Inventory.listForVenue(options).$promise;
      };

      return new InventoryService();
    }
  ]);
