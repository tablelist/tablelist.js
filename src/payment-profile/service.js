angular
  .module('tl')
  .service('tl.payment.service', ['tl.service', 'tl.payment.resource', 'tl.utils',
    function(Service, Payment, utils) {
      'use strict';

      var PaymentService = Service.extend(Payment);

      PaymentService.prototype.addPaymentProfile = function(options) {
        var data = {
          cardholderName: options.name,
          cardNumber: utils.digits(options.number),
          cardExpMonth: utils.digits(options.month),
          cardExpYear: utils.digits(options.year),
          cardCvv: utils.digits(options.cvv),
          cardZip: utils.digits(options.zip)
        }
        return this.create(data).$promise;
      };

      PaymentService.prototype.updatePaymentProfile = function(options) {
        var profileId = options.id;
        if (!profileId) {
          throw "An existing profile is required. Missing options.id";
        }
        var data = {
          cardholderName: options.name,
          cardNumber: utils.digits(options.number),
          cardExpMonth: utils.digits(options.month),
          cardExpYear: utils.digits(options.year),
          cardCvv: utils.digits(options.cvv),
          cardZip: utils.digits(options.zip)
        }
        return this.update(profileId, data).$promise;
      };

      // Deprecated

      PaymentService.prototype.addProfile = function(name, number, month, year, cvv, address, city, state, zip, success, error) {
        console.log('DEPRECATED - use .addPaymentProfile');
        var data = {
          cardholderName: name,
          cardNumber: utils.digits(number),
          cardExpMonth: utils.digits(month),
          cardExpYear: utils.digits(year),
          cardCvv: utils.digits(cvv),
          cardZip: utils.digits(zip),
          address: {
            address: address,
            city: city,
            state: state
          }
        }

        return this.create(data, success, error);
      };

      PaymentService.prototype.updateProfile = function(profileId, name, number, month, year, cvv, address, city, state, zip, success, error) {
        console.log('DEPRECATED - use .updatePaymentProfile');
        if (!profileId) {
          return this.addProfile(name, number, month, year, cvv, address, city, state, zip, success, error);
        }

        var data = {
          cardholderName: name,
          cardNumber: utils.digits(number),
          cardExpMonth: utils.digits(month),
          cardExpYear: utils.digits(year),
          cardCvv: utils.digits(cvv),
          cardZip: utils.digits(zip),
          address: {
            address: address,
            city: city,
            state: state
          }
        }

        return this.update(profileId, data, success, error);
      };

      return new PaymentService();
    }
  ]);
