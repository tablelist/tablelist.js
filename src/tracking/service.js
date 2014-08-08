
angular
	.module('tl')
	.constant('EVENTS', {

	})
	.service('tl.track.service', ['tl.service', 'tl.track.resource', 'EVENTS', 'tl.config', function(Service, Track, EVENTS, config){

		var TrackService = Service.extend(Track);

		TrackService.prototype.trackingEvents = function() {
			return EVENTS;
		};

		TrackService.prototype.send = function(eventName, data) {
			var track = {
				event: eventName,
				data: data,
				client = {
					os: 'web',
					version: config.VERSION,
					device: window.navigator ? window.navigator.userAgent : null
				}
			};
			return Track.save({}, track);
		};

		return new TrackService();
	}]);