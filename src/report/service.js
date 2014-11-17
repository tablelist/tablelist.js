
angular
	.module('tl')
	.service('tl.report.service', ['tl.service', 'tl.report.resource', function(Service, Report){

		var ReportService = Service.extend(Report);

		ReportService.prototype.reports = function(success, error) {
			return Report.reports({}, success, error);
		};

		return new ReportService();
	}]);