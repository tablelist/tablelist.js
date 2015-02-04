
angular
	.module('tl')
	.service('tl.inquiry.service', ['tl.service', 'tl.inquiry.resource', function(Service, Inquiry){

		var InquiryService = Service.extend(Inquiry);


	    InquiryService.prototype.approve = function(inquiryId, success, error) {
	      return Inquiry.approve({
	        id: inquiryId
	      }, success, error);
	    };

	    InquiryService.prototype.decline = function(inquiryId, reason, success, error) {
	      return Inquiry.decline({
	        id: inquiryId,
	        reason: reason
	      }, success, error);
	    };

		return new InquiryService();
	}]);