angular
  .module('tl')
  .service('tl.venue.service', [
    'tl.service',
    'tl.venue.resource',
    function(Service, Venue) {
      'use strict';

      var VenueService = Service.extend(Venue);

      VenueService.prototype.list = function list(options) {
        if (!options) throw new Error('options is required');

        options.query = options.query ? JSON.stringify(options.query) : options.query;

        return Venue.list(options).$promise;
      };

      VenueService.prototype.read = function read(options) {
        if (!options) throw new Error('options is required');
        if (!options.id) throw new Error('options.id is required');

        return Venue.get(options).$promise;
      };

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

      VenueService.prototype.listForCity = function(options) {
        if (!options) throw new Error('options.required');
        if (!options.cityId) throw new Error('options.cityId is required');

        return Venue.listForCity(options).$promise;
      };

      VenueService.prototype.listCityFeatured = function(options) {
        if (!options) throw new Error('options.required');
        if (!options.cityId) throw new Error('options.cityId is required');

        return Venue.listCityFeatured(options).$promise;
      };

      VenueService.prototype.listCityTonight = function(options) {
        if (!options) throw new Error('options.required');
        if (!options.cityId) throw new Error('options.cityId is required');

        return Venue.listCityTonight(options).$promise;
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

      VenueService.prototype.listEvents = function(options) {
        if (!options) throw new Error('options.required');
        if (!options.id) throw new Error('options.id is required');

        return Venue.listEvents(options).$promise;
      };

      VenueService.prototype.listReviews = function(options) {
        if (!options) throw new Error('options.required');
        if (!options.id) throw new Error('options.id is required');

        return Venue.listReviews(options).$promise;
      };

      return new VenueService();
    }
  ]);
