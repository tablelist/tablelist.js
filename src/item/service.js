angular
  .module('tl')
  .service('tl.item.service', ['tl.service', 'tl.item.resource', function(Service, Item) {

    var ItemService = Service.extend(Item);

    ItemService.prototype.list = function list(options) {
      if (!options) throw new Error('options is required');

      options.query = options.query ? JSON.stringify(options.query) : options.query;

      return Item.list(options).$promise;
    };

    return new ItemService();
  }]);
