angular
  .module('tl')
  .service('tl.booking.service', ['tl.booking.resource', 'tl.service', function(Booking, Service) {

    var BookingService = Service.extend(Booking);

    BookingService.prototype.create = function(data, success, error) {
      return Booking.create({}, data, success, error);
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

    BookingService.prototype.accept = function(id, success, error) {
      return Booking.accept({}, {
        id: id
      }, success, error);
    };

    BookingService.prototype.updateBookingUser = function(id, userId, updates, success, error) {
      return Booking.updateBookingUser({
        id: id,
        userId: userId
      }, updates, success, error);
    };

    return new BookingService();
  }]);
