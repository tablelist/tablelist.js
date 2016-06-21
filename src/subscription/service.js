angular
	.module('tl')
	.service('tl.subscription.service', ['tl.service', 'tl.subscription.resource',
    function(Service, Subscription){
      'use strict';

      var SUBSCRIPTION_ACTION = {
        UPDATE_PAYMENT_METHOD: 'UPDATE_PAYMENT_METHOD'
      };

      var SubscriptionService = Service.extend(Subscription);

      /**
       * Cancel a single user subscription
       *
       * @method cancelSubscription
       * @param {String} id
       * @param {Object} success
       * @param {Object} error
       */
      SubscriptionService.prototype.cancelSubscription = function(id, success, error) {
        return Subscription.cancelSubscription({
          id: id
        }, success, error);
      };

      /**
       * Update the payment profile for a user's subscription
       *
       * @method updateSubscriptionPaymentMethod
       * @param {Object} options
       * @param {Object} success
       * @param {Object} error
       * @param {String} [options.id] - id of subscription to update
       * @param {String} [options.paymentProfileId] - payment profile to charge
       */
      SubscriptionService.prototype.updateSubscriptionPaymentMethod = function(options, success, error) {
        if (!options) throw new Error('options is required');
        if (!options.id) throw new Error('options.id is required');
        if (!options.paymentProfileId) throw new Error('options.paymentProfileId is required');

        var body = {
          type: SUBSCRIPTION_ACTION.UPDATE_PAYMENT_METHOD,
          paymentProfileId: options.paymentProfileId
        };

        return Subscription.subscriptionAction({
          id: options.id
        }, body, success, error);
      };

      return new SubscriptionService();
	}]);