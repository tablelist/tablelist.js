
angular
	.module('tl')
	.service('tl.event.service', ['tl.service', 'tl.event.resource', function(Service, Event){

		var EventService = Service.extend(Event);

		/*==============================================================*
		/* Cities
		/*==============================================================*/

		EventService.prototype.listForCity = function(cityId, success, error) {
			return Event.listForCity({ cityId: cityId }, success, error);
		};

		EventService.prototype.listCityTonight = function(cityId, success, error) {
			return Event.listCityTonight({ cityId: cityId }, success, error);
		};

		return new EventService();
	}]);