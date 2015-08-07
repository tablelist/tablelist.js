angular
  .module('tl')
  .service('tl.promo.service', ['tl.storage', 'tl.promo.resource', 'tl.service',
    function(storage, Promo, Service) {

      var PromoService = Service.extend(Promo);

      PromoService.prototype.redeem = function(promoCode) {
        return Promo.redeem({
          code: promoCode
        });
      };

      return new PromoService();
    }
  ]);
