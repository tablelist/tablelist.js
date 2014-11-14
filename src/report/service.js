
angular
	.module('tl')
	.service('tl.report.service', ['tl.service', 'tl.report.resource', function(Service, Report){

		var ReportService = Service.extend(Report);

		return new ReportService();
	}]);