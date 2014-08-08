
angular
	.module('tl')
	.service('tl.item.service', ['tl.service', 'tl.item.resource', function(Service, Item){

		var ItemService = Service.extend(Item);

		return new ItemService();
	}]);