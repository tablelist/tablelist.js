angular
  .module('tl')
  .factory('tl.promo.resource', ['tl.resource', function(resource) {

    var endpoint = '/promo/:id';
    //           = '/promo/check/:code'

    return resource(endpoint, {
      id: '@id',
      code: '@code',
    }, {
      redeem: {
        method: 'POST',
        url: '/promo/redeem'
      },
    }, {
      check: {
        method: 'GET',
        url: '/promo/check/:code'
      },
    });
  }]);
