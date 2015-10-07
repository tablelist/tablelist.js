angular
  .module('tl')
  .service('tl.sale.service', [
    'tl.service',
    'tl.sale.resource',
    '$http',
    'tl.http',
    function(Service, Sale, $http, http) {

      var SaleService = Service.extend(Sale);

      SaleService.prototype.read = function read(options) {
        if (!options) throw new Error('options is required');
        if (!options.id) throw new Error('options.id is required');

        return Sale.read(options).$promise;
      };

      SaleService.prototype.update = function update(options) {
        if (!options) throw new Error('options is required');
        if (!options.id) throw new Error('options.id is required');

        var id = options.id;
        delete options.id;

        return Sale.update({
          id: id
        }, options).$promise;
      };

      SaleService.prototype.list = function(options) {
        if (!options) throw new Error('options is required');

        options.query = options.query ? JSON.stringify(options.query) : options.query;

        return Sale.list(options).$promise;
      };

      SaleService.prototype.listAsCsv = function(options) {
        if (!options) throw new Error('options is required');

        return $http.get(http.apiUrl('/sale'), {
          params: options,
          data: '', //needed, otherwise the content-type header is not sent (the req must have a body)
          headers: {
            'Content-Type': 'text/csv'
          }
        });
      };

      return new SaleService();
    }
  ]);
