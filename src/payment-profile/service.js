angular
  .module('tl')
  .service('tl.payment.service', ['tl.service', 'tl.payment.resource', 'tl.utils',
    function(Service, Payment, utils) {
      'use strict';

      var PaymentService = Service.extend(Payment);

      PaymentService.prototype.addProfile = function(name, number, month, year, cvv, address, city, state, zip, success, error) {
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
        };

        return this.create(data, success, error);
      };

      PaymentService.prototype.updateProfile = function(profileId, name, number, month, year, cvv, address, city, state, zip, success, error) {
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
        };

        return this.update(profileId, data, success, error);
      };

      return new PaymentService();
    }
  ]);
