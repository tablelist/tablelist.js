angular
  .module('tl')
  .service('tl.venue.service', [
    'tl.service',
    'tl.venue.resource',
    function(Service, Venue) {
      'use strict';

      var VenueService = Service.extend(Venue);

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

      VenueService.prototype.listInventory = function(options, id, start, end, ticket, success, error) {
        if (!options) throw new Error('options.required');
        if (!options.id) throw new Error('options.id is required');

        options.ticket = options.ticket || 'false';

        //options.start
        //options.end

        var venueId = options.id;
        delete options.venueId;

        return Venue.listInventory({
          id: venueId
        }, options).$promise;
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
