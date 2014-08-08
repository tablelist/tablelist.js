
angular
	.module('tl')
	.service('tl.table.service', ['tl.service', 'tl.table.resource', function(Service, Table){

		var TableService = Service.extend(Table);

		return new TableService();
	}]);