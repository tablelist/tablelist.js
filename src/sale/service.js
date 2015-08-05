angular
  .module('tl')
  .service('tl.sale.service', ['tl.service', 'tl.sale.resource', function(Service, Sale) {

    var SaleService = Service.extend(Sale);

    SaleService.prototype.list = function(options) {
      if (!options) throw new Error('options is required');

      options.query = options.query ? JSON.stringify(options.query) : options.query;

      return Sale.list(options).$promise;
    };

    return new SaleService();
  }]);
