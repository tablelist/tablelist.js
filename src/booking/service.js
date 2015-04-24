angular.module('tl').service('tl.booking.service', [
  'tl.booking.resource',
  'tl.service',
  function(Booking, Service) {
    'use strict';

    /*==============================================================*
    /* Constants
    /*==============================================================*/
    var DEFAULT_LIMIT = 100;
    var DEFAULT_SORT = '-created';

    /*==============================================================*
    /* Constructor
    /*==============================================================*/
    var BookingService = Service.extend(Booking);

    BookingService.prototype.read = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      return Booking.read(options).$promise;
    };

    BookingService.prototype.query = function(options) {
      if (!options) throw new Error('options is required');

      var opts = {};
      var _this = this;

      opts.sort = options.sort || DEFAULT_SORT;
      opts.limit = options.limit || DEFAULT_LIMIT;
      opts.admin = options.admin || false;
      delete options.sort;
      delete options.limit;
      delete options.admin;
      opts.query = options;
      opts.query = _this.buildQueryString(opts.query);

      return Booking.query(opts).$promise;
    };

    BookingService.prototype.create = function(options) {
      if (!options) throw new Error('options is required');

      return Booking.create({}, options).$promise;
    };

    BookingService.prototype.complete = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      var bookingId = options.id;
      delete options.id;

      return Booking.complete({
        id: bookingId
      }, options).$promise;
    };

    BookingService.prototype.void = function(id, notify, success, error) {
      return Booking.void({}, {
        id: id,
        notify: notify ? true : false
      }, success, error);
    };

    BookingService.prototype.refund = function(id, amount, reason, success, error) {
      return Booking.refund({}, {
        id: id,
        money: amount,
        reason: reason
      }, success, error);
    };

    BookingService.prototype.join = function(splitCode, success, error) {
      return Booking.join({}, {
        splitCode: splitCode,
      }, success, error);
    };

    BookingService.prototype.decline = function(id, userId, success, error) {
      return Booking.decline({
        id: id
      }, {
        userId: userId
      }, success, error);
    };

    BookingService.prototype.updateBookingUser = function(id, userId, updates, success, error) {
      return Booking.updateBookingUser({
        id: id,
        userId: userId
      }, updates, success, error);
    };

    BookingService.prototype.listOutgoingPayment = function(id, success, error) {
      return Booking.listOutgoingPayment({
        id: id,
      }, success, error);
    };

    BookingService.prototype.createOutgoingPayment = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      var id = options.id;
      delete options.id;

      return Booking.createOutgoingPayment({
        id: id,
      }, options).$promise;
    };

    BookingService.prototype.readSplitTable = function(splitCode, success, error) {
      return Booking.readSplitTable({
        code: splitCode
      }, {}, success, error);
    };

    BookingService.prototype.listTerms = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      return Booking.listTerms(options).$promise;
    };

    BookingService.prototype.addCondition = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');
      if (!options.condition) throw new Error('options.condition is required');

      var id = options.id;
      delete options.id;

      return Booking.addCondition({
        id: id
      }, options).$promise;
    };

    BookingService.prototype.accept = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');
      if (!options.userId) throw new Error('options.userId is required');
      if (!options.paymentProfileId) throw new Error('options.paymentProfileId is required');

      var id = options.id;
      delete options.id;

      return Booking.accept({
        id: id
      }, options).$promise;
    };

    BookingService.prototype.refundBookingUser = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');
      if (!options.userId) throw new Error('options.userId is required');
      if (!options.type) throw new Error('options.type is required');

      var id = options.id;
      delete options.id;
      var userId = options.userId;
      delete options.userId;

      return Booking.refundBookingUser({
        id: id,
        userId: userId
      }, options).$promise;
    };

    BookingService.prototype.listBookingTickets = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      var id = options.id;
      delete options.id;

      return Booking.listBookingTickets({
        id: id,
      }, options).$promise;
    };

    BookingService.prototype.update = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      var id = options.id; 
      delete options.id;

      return Booking.update({
        id: id,
      }, options).$promise;
    };

    return new BookingService();
  }
]);
