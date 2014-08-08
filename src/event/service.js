
angular
	.module('tl')
	.service('tl.event.service', ['tl.service', 'tl.event.resource', function(Service, Event){

		var EventService = Service.extend(Event);

		return new EventService();
	}]);