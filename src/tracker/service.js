angular
  .module('tl')
  .service('tl.tracker.service', [
    'tl.service',
    'tl.tracker.resource',
    function(Service, Tracker) {
      'use strict';

      var TrackerService = Service.extend(Tracker);

      TrackerService.prototype.create = function(options) {
        return Tracker.save({}, options).$promise;
      };

      return new TrackerService();
    }
  ]);
