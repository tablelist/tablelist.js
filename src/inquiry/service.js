angular
  .module('tl')
  .service('tl.inquiry.service', [
    'tl.service',
    'tl.inquiry.resource',
    function(Service, Inquiry) {
      'use strict';

      /*==============================================================*
      /* Constants
      /*==============================================================*/
      var DEFAULT_LIMIT = 100;
      var DEFAULT_SORT = '-created';

      /*==============================================================*
      /* Constructor
      /*==============================================================*/
      var InquiryService = Service.extend(Inquiry);

      InquiryService.prototype.list = function(options) {
        if (!options) throw new Error('options is required');

        options.sort = options.sort || DEFAULT_SORT;
        options.limit = options.limit || DEFAULT_LIMIT;

        return Inquiry.list(options).$promise;
      };

      InquiryService.prototype.approve = function(options) {
        if (!options) throw new Error('options is required');
        if (!options.inquiryId) throw new Error('options.inquiryId is required');

        options.id = options.inquiryId;
        delete options.inquiryId;

        return Inquiry.approve(options).$promise;
      };

      InquiryService.prototype.decline = function(options) {
        if (!options) throw new Error('options is required');
        if (!options.inquiryId) throw new Error('options.inquiryId is required');

        options.id = options.inquiryId;
        delete options.inquiryId;

        return Inquiry.decline(options).$promise;
      };

      return new InquiryService();
    }
  ]);
