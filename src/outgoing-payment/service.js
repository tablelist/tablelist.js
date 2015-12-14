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

    OutgoingPaymentService.prototype.update = function(id, options) {
      if (!id) throw new Error('id is required');
      if (!options) throw new Error('options is required');

      return OutgoingPayment.update({
        id: id
      }, options).$promise;
    };

    OutgoingPaymentService.prototype.delete = function(id) {
      if (!id) throw new Error('id is required');

      return OutgoingPayment.delete({
        id: id
      }).$promise;
    };


    return new OutgoingPaymentService();
  }
]);
