angular
  .module('tl')
  .service('tl.venue.service', ['tl.service', 'tl.venue.resource', function(Service, Venue) {

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

    VenueService.prototype.listInventory = function(id, start, end, ticket, success, error) {

      return Venue.listInventory({
        id: id,
        start: start,
        end: end,
        ticket: ticket
      }, success, error);
    };

    /*==============================================================*
		/* Items
		/*==============================================================*/

    VenueService.prototype.listItems = function(id, success, error) {

      return Venue.listItems({
        id: id
      }, success, error);
    };



    /**
     * Returns an array of a users venues (staff-only)
     */
    VenueService.prototype.listVenues = function(listVenues, success, error) {
      return User.listVenues({
        listVenues: listVenues
      }, success, error);
    };

    return new VenueService();
  }]);
