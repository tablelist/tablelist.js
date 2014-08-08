
angular
	.module('tl')
	.service('tl.inventory.service', ['tl.service', 'tl.inventory.resource', function(Service, Inventory){

		var InventoryService = Service.extend(Inventory);

		return new InventoryService();
	}]);