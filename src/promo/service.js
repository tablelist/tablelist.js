(function() {
  'use strict';

  angular
    .module('tl')
    .service('tl.promo.service', ['tl.storage', 'tl.promo.resource', 'tl.service',
      function(storage, Promo, Service) {

        var PromoService = Service.extend(Promo);

        PromoService.prototype.redeem = function(promoCode, success, error) {
          var _this = this;
          return Promo.redeem({
            code: promoCode
          });
        };

        return new PromoService();
      }
    ]);
}());
