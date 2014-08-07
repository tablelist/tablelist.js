
angular
	.module('tl')
	.service('tl.venue', ['tl.service', 'tl.venue.resource', function(Service, Venue){

		var VenueService = Service.extend(Venue);

		return new VenueService();
	}]);