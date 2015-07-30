angular
  .module('tl')
  .service('tl.inventory-tier-config.service', [
    'tl.service',
    'tl.inventory-tier-config.resource',
    function(Service, InventoryTierConfig) {
      'use strict';

      var InventoryTierConfigService = Service.extend(InventoryTierConfig);

      InventoryTierConfigService.prototype.create = function(options) {
        if (!options) throw new Error('options is required');

        return InventoryTierConfig.save({}, options).$promise;
      };

      InventoryTierConfigService.prototype.list = function(options) {
        if (!options) throw new Error('options is required');

        return InventoryTierConfig.list(options).$promise;
      };

      return new InventoryTierConfigService();
    }
  ]);
