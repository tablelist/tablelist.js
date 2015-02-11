angular
  .module('tl')
  .service('tl.venue.service', [
    'tl.service',
    'tl.venue.resource',
    function(Service, Venue) {
      'use strict';

      var VenueService = Service.extend(Venue);

      VenueService.prototype.create = function create(options) {
        if (!options) throw new Error('options is required');

        return Venue.save({}, options).$promise;
      };

      VenueService.prototype.update = function update(options) {
        if (!options) throw new Error('options is required');
        if (!options.id) throw new Error('options.id is required');

        return Venue.update({
          id: options.id
        }, options).$promise;
      };

      /*==============================================================*
      /* Cities
      /*==============================================================*/

      VenueService.prototype.listForCity = function(cityId, success, error) {
        return Venue.listForCity({
          cityId: cityId
        }, success, error);
      };

      VenueService.prototype.listCityFeatured = function(cityId, success, error) {
        return Venue.listCityFeatured({
          cityId: cityId
        }, success, error);
      };

      VenueService.prototype.listCityTonight = function(cityId, success, error) {
        return Venue.listCityTonight({
          cityId: cityId
        }, success, error);
      };

      /*==============================================================*
      /* Inventory
      /*==============================================================*/

      VenueService.prototype.listInventory = function(options) {
        if (!options) throw new Error('options.required');
        if (!options.id) throw new Error('options.id is required');

        options.start = options.start || moment().startOf('month').format("YYYY-MM-DD");
        options.end = options.end || moment().endOf('month').format("YYYY-MM-DD");
        options.ticket = options.ticket || 'false';

        return Venue.listInventory(options).$promise;
      };

      /*==============================================================*
      /* Items
      /*==============================================================*/

      VenueService.prototype.listItems = function(id, success, error) {

        return Venue.listItems({
          id: id
        }, success, error);
      };

      VenueService.prototype.listBookings = function(params, success, error) {
        return Venue.listBookings(params, success, error);
      };

      return new VenueService();
    }
  ]);
