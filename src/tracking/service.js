
angular
	.module('tl')
	.service('tl.track.service', ['tl.service', 'tl.track.resource', 'TRACK_EVENTS', 'tl.config', function(Service, Track, EVENTS, config){

		var TrackService = Service.extend(Track);
		
		/**
		 * Returns a map of valid tracking events
		 */
		TrackService.prototype.trackingEvents = function() {
			return EVENTS;
		};

		/**
		 * Send a tracking event to the server
		 */
		TrackService.prototype.send = function(eventName, data) {
			var track = {
				event: eventName,
				data: data,
				client: {
					os: config.CLIENT,
					version: config.VERSION,
					device: window.navigator ? window.navigator.userAgent : null
				}
			};

			if(config.SUB_CLIENT) track.client.os = track.client.os + ('-' + config.SUB_CLIENT);

			return Track.save({}, track);
		};

		return new TrackService();
	}]);