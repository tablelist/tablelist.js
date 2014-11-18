
angular
	.module('tl')
	.service('tl.report.service', ['tl.service', 'tl.report.resource', function(Service, Report){

		var ReportService = Service.extend(Report);

		ReportService.prototype.reports = function(success, error) {
			return Report.reports({}, success, error);
		};

		ReportService.prototype.listReports = function(key, success, error) {
			return Report.query({ report: key }, success, error);
		};

		ReportService.prototype.download = function(reportId, success, error) {
			return Report.download({ id: reportId }, success, error);
		};

		return new ReportService();
	}]);