angular
  .module('tl')
  .service('tl.payment.service', ['tl.service', 'tl.payment.resource',
    function(Service, Payment) {
      'use strict';

      var PaymentService = Service.extend(Payment);

      PaymentService.prototype.addProfile = function(name, number, month, year, cvv, address, city, state, zip, success, error) {
        var data = {
          cardholderName: name,
          cardNumber: digits(number),
          cardExpMonth: digits(month),
          cardExpYear: digits(year),
          cardCvv: digits(cvv),
          cardZip: digits(zip),
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
          cardNumber: digits(number),
          cardExpMonth: digits(month),
          cardExpYear: digits(year),
          cardCvv: digits(cvv),
          cardZip: digits(zip),
          address: {
            address: address,
            city: city,
            state: state
          }
        }

        return this.update(profileId, data, success, error);
      };

      function digits(text) {
        return text ? text.replace(/\D/g, '').trim() : null;
      }

      return new PaymentService();
    }
  ]);
