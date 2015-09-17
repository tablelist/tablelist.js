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

      InventoryService.prototype.createTier = function(inventoryId, options) {
        if (!inventoryId) throw new Error('inventoryId is required');
        if (!options) throw new Error('options is required');
        if (options.price === undefined) throw new Error('options.price is required');
        if (options.quantity === undefined) throw new Error('options.quantity is required');

        return Inventory.createTier({
          id: inventoryId
        }, options).$promise;
      };

      InventoryService.prototype.updateTier = function(inventoryId, tierId, options) {
        if (!inventoryId) throw new Error('inventoryId is required');
        if (!tierId) throw new Error('tierId is required');
        if (!options) throw new Error('options is required');

        return Inventory.updateTier({
          id: inventoryId,
          tierId: tierId
        }, options).$promise;
      };

      InventoryService.prototype.deleteTier = function(inventoryId, tierId, options) {
        if (!inventoryId) throw new Error('inventoryId is required');
        if (!tierId) throw new Error('tierId is required');

        return Inventory.deleteTier({
          id: inventoryId,
          tierId: tierId
        }, options).$promise;
      };

      return new InventoryService();
    }
  ]);
