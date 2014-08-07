
angular
	.module('tl')
	.service('tl.booking', ['tl.booking.resource', 'tl.service', function(Booking, Service){

		var BookingService = Service.extend(Booking);

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

		return new BookingService();
	}]);