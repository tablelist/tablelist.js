angular
  .module('tl')
  .service('tl.payment.service', ['tl.service', 'tl.payment.resource', 'tl.utils',
    function(Service, Payment, utils) {
      'use strict';

      var PaymentService = Service.extend(Payment);

       /**
        * Create a new payment profile with
        * a nonce token from braintree
        *
        * @method addPaymentMethodNonce
        * @param {Object} options
        * @param {String} options.paymentMethodNonce - nonce token from braintree
        */
      PaymentService.prototype.addPaymentMethodNonce = function(options) {
        var data = {
          paymentMethodNonce : options.paymentMethodNonce,
        };

        return this.create(data).$promise;
      };

      /**
       * Set a payment profile as the user's default.
       * Removes the 'default' flag from the previous default profile.
       *
       * @method setDefaultPaymentProfile
       * @param {Object} options
       * @param {String} options.id - payment profile id
       */
      PaymentService.prototype.setDefaultPaymentProfile = function(options) {

        var profileId = options.id;
        
        if (!profileId) {
          throw "An existing profile is required. Missing options.id";
        }
        var data = {
          default : true
        };
        
        return this.update(profileId, data).$promise;
      };

      /**
       * Creates a new payment profile on a user
       * from an entered credit card.
       *
       * @deprecated
       * @method addPaymentProfile
       * @param {Object} options
       * @param {String} options.name
       * @param {String} options.number
       * @param {String} options.month
       * @param {String} options.year
       * @param {String} options.cvv
       * @param {String} options.zip
       */
      PaymentService.prototype.addPaymentProfile = function(options) {
        console.log('DEPRECATED - use .addPaymentMethodNonce');

        var data = {
          cardholderName: options.name,
          cardNumber: utils.digits(options.number),
          cardExpMonth: utils.digits(options.month),
          cardExpYear: utils.digits(options.year),
          cardCvv: utils.digits(options.cvv),
          cardZip: utils.digits(options.zip)
        };
        return this.create(data).$promise;
      };

      /**
       * Updates a payment profile on a user
       *
       * @deprecated
       * @method updatePaymentProfile
       * @param {Object} options
       * @param {String} options.name
       * @param {String} options.number
       * @param {String} options.month
       * @param {String} options.year
       * @param {String} options.cvv
       * @param {String} options.zip
       */
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
        };
        return this.update(profileId, data).$promise;
      };

      
      /**
       * Creates a new payment profile on a user
       * from an entered credit card.
       *
       * @deprecated
       * @method addPaymentProfile
       * @param {String} name
       * @param {String} number
       * @param {String} month
       * @param {String} year
       * @param {String} cvv
       * @param {String} address
       * @param {String} city
       * @param {String} state
       * @param {String} zip
       * @param {Function} success
       * @param {Function} error
       */
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
        };

        return this.create(data, success, error);
      };

      /**
       * Updates a payment profile on a user
       *
       * @deprecated
       * @method addPaymentProfile
       * @param {String} profileId
       * @param {String} name
       * @param {String} number
       * @param {String} month
       * @param {String} year
       * @param {String} cvv
       * @param {String} address
       * @param {String} city
       * @param {String} state
       * @param {String} zip
       * @param {Function} success
       * @param {Function} error
       */
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
        };

        return this.update(profileId, data, success, error);
      };

      return new PaymentService();
    }
  ]);
