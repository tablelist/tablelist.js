angular
  .module('tl')
  .service('tl.track.service', ['tl.service', 'tl.track.resource', 'TRACK_EVENTS', 'tl.config', function(Service, Track, EVENTS, config) {

    var AFFILIATE = null;

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

      if (config.SUB_CLIENT) track.client.os = track.client.os + ('-' + config.SUB_CLIENT);
      if (AFFILIATE) {
        track.data = track.data || {};
        track.data.affiliate = AFFILIATE;
      }

      return Track.save({}, track);
    };

    TrackService.prototype.setAffiliate = function(affiliateId) {
      AFFILIATE = affiliateId || null;
    };

    TrackService.prototype.listPossibleEvents = function(success, error) {
      return Track.listPossibleEvents({}, success, error).$promise;
    };

		TrackService.prototype.funnel = function(events, options, success, error) {
			return Track.funnel({}, {
				events: events,
				start: options.start.getTime(),
				end: options.end.getTime(),
				data: options.data,
				client: options.client
			}, success, error).$promise;
		};

		return new TrackService();
	}]);
