
angular
	.module('tl')
	.service('tl.track.service', ['tl.service', 'tl.track.resource', 'TRACK_EVENTS', 'tl.config', function(Service, Track, EVENTS, config){

		var TrackService = Service.extend(Track);
		
		TrackService.prototype.trackingEvents = function() {
			return EVENTS;
		};

		TrackService.prototype.send = function(eventName, data) {
			var track = {
				event: eventName,
				data: data,
				client: {
					os: 'web',
					version: config.VERSION,
					device: window.navigator ? window.navigator.userAgent : null
				}
			};
			return Track.save({}, track);
		};

		return new TrackService();
	}]);