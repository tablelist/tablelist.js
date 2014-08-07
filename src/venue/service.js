
angular
	.module('tl')
	.service('tl.venue', ['tl.service', 'tl.venue.resource', function(Service, Venue){

		var VenueService = Service.extend(Venue);

		/*==============================================================*
		/* Cities
		/*==============================================================*/

		VenueService.prototype.listForCity = function(cityId, success, error) {
			return Venue.listForCity({ cityId: cityId }, success, error);
		};

		VenueService.prototype.listCityFeatured = function(cityId, success, error) {
			return Venue.listCityFeatured({ cityId: cityId }, success, error);
		};

		VenueService.prototype.listCityTonight = function(cityId, success, error) {
			return Venue.listCityTonight({ cityId: cityId }, success, error);
		};

		return new VenueService();
	}]);