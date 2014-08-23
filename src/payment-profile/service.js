
angular
	.module('tl')
	.service('tl.payment.service', ['tl.service', 'tl.payment.resource', function(Service, Payment){

		var PaymentService = Service.extend(Payment);

		PaymentService.prototype.addProfile = function(name, number, month, year, cvv, address, city, state, zip, success, error) {
			var data = {
				cardholderName: name,
				cardNumber: number,
				cardExpMonth: month,
				cardExpYear: year,
				cardCvv: cvv,
				cardZip: zip,
				address: {
					address: address,
					city: city,
					state: state
				}
			}

			return this.create(data, success, error);
		};

		PaymentService.prototype.updateProfile = function(profileId, name, number, month, year, cvv, address, city, state, zip, success, error) {
			if (!profileId) {
				return this.addProfile(name, number, month, year, cvv, address, city, state, zip, success, error);
			}

			var data = {
				cardholderName: name,
				cardNumber: number,
				cardExpMonth: month,
				cardExpYear: year,
				cardCvv: cvv,
				cardZip: zip,
				address: {
					address: address,
					city: city,
					state: state
				}
			}

			return this.update(profileId, data, success, error);
		};

		return new PaymentService();
	}]);