
angular
	.module('tl')
	.service('tl.schedule.service', ['tl.service', 'tl.schedule.resource', function(Service, Schedule){

		var ScheduleService = Service.extend(Schedule);

		return new ScheduleService();
	}]);