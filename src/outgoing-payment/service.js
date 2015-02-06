angular.module('tl').service('tl.outgoingPayment.service', [
  'tl.outgoingPayment.resource',
  'tl.service',
  function(OutgoingPayment, Service) {
    'use strict';

    /*==============================================================*
    /* Constructor
    /*==============================================================*/

    var OutgoingPaymentService = Service.extend(OutgoingPayment);

    OutgoingPaymentService.prototype.listTransaction = function(id, success, error) {
      return OutgoingPayment.listTransaction({
        id: id,
      }, success, error);
    };

    OutgoingPaymentService.prototype.listAuthorization = function(id, success, error) {
      return OutgoingPayment.listAuthorization({
        id: id,
      }, success, error);
    };

    return new OutgoingPaymentService();
  }
]);
