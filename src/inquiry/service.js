
angular
	.module('tl')
	.service('tl.inquiry.service', ['tl.service', 'tl.event.resource', function(Service, Inquiry){

		var InquiryService = Service.extend(Inquiry);

		return new InquiryService();
	}]);